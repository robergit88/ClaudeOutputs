// Servidor MCP de SOLO LECTURA sobre la API web ZEXPENSE2.
// Herramientas:
//   - buscar_informes_gastos -> GET ExpenseReport (cabecera)
//   - ver_posiciones_informe -> GET ExpenseItem   (posiciones de un informe)
//
// Importante: en un servidor MCP por stdio, la salida estándar (stdout) es
// el canal del protocolo. Los mensajes de log van siempre por console.error.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { config } from "./config.js";
import { getAccessToken, invalidateAccessToken } from "./auth.js";

const REPORT_ID_LENGTH = 10; // report_id : abap.char(10); el número real ocupa 8 posiciones

const READ_ONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
};

// ---------- textos de los códigos (para que la IA y el usuario los entiendan) ----------
const HEADER_STATUS_TEXT = {
  OPEN: "Abierta",
  SENT: "Enviada",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
};
const EXPENSE_TYPE_TEXT = { // ZVH_EXPENSE_TYPE
  HOTEL: "Hotel",
  TAXI: "Taxi / Uber",
  MEAL: "Comida",
  KM: "Kilometraje",
};
const ITEM_STATUS_TEXT = { // ZVH_ITEM_STATUS
  VALID: "Válido",
  PENDING: "Pendiente factura",
  OBSERVED: "Observado",
};

// ---------- helpers OData ----------
const quote = (s) => `'${String(s).replace(/'/g, "''")}'`;
const stripZeros = (value) => {
  const v = String(value).trim();
  return /^\d+$/.test(v) ? String(Number(v)) : v;
};
// "7" o "0000000007" -> "7"
const toReportId = stripZeros;
// "000121" -> "121" (el CustomerID viene sin ceros a la izquierda)
const toCustomerId = stripZeros;

// El ReportId está guardado con relleno ("       7" / "00000007", 8 posiciones).
// Para no depender del relleno exacto, se filtra por todas las variantes (OR)
// con espacios y con ceros, y luego se compara exacto en el programa.
function reportIdFilter(rawId) {
  const id = toReportId(rawId);
  const variants = new Set([id]);
  if (/^\d+$/.test(id)) {
    for (let len = id.length + 1; len <= REPORT_ID_LENGTH; len++) {
      variants.add(id.padStart(len, " "));
      variants.add(id.padStart(len, "0"));
    }
  }
  return `(${[...variants].map((v) => `ReportId eq ${quote(v)}`).join(" or ")})`;
}

function buildUrl(entity, { select, filters, orderby, top }) {
  const params = new URLSearchParams();
  params.set("$select", select);
  if (filters.length) params.set("$filter", filters.join(" and "));
  params.set("$orderby", orderby);
  params.set("$top", String(top));
  if (config.sapClient) params.set("sap-client", config.sapClient);
  return `${config.serviceUrl}${entity}?${params.toString().replace(/\+/g, "%20")}`;
}

async function odataGet(url) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    const token = await getAccessToken();
    const res = await fetch(url, {
      method: "GET", // único verbo que usa este servidor
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      redirect: "manual",
    });
    if (res.status === 401 && attempt === 1) {
      invalidateAccessToken();
      continue;
    }
    if (res.status >= 300 && res.status < 400) {
      throw new Error(`El servicio redirigió (${res.status}), seguramente a una página de login. Revisá el host de SERVICE_URL.`);
    }
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error OData (${res.status}): ${text.slice(0, 500)}`);
    }
    return res.json();
  }
}

const ok = (text) => ({ content: [{ type: "text", text }] });
const fail = (tool, e) => {
  console.error(`[${tool}] ${e.message}`);
  return { isError: true, content: [{ type: "text", text: e.message }] };
};

// ---------- servidor MCP ----------
const server = new McpServer({ name: "zexpense2", version: "0.2.0" });

// ===== Herramienta 1: cabeceras =====
server.registerTool(
  "buscar_informes_gastos",
  {
    title: "Buscar informes de gastos",
    description:
      "Busca cabeceras de informes de gastos en SAP (app ZEXPENSE2). " +
      "Usala cuando el usuario pregunte por sus informes de gastos, estados, importes o fechas. " +
      "Estados: OPEN = abierta (todavía no enviada), SENT = enviada (pendiente de aprobación), " +
      "APPROVED = aprobada, REJECTED = rechazada (ver RejectReason). " +
      "Sin filtros devuelve los más recientes. Para ver el detalle (posiciones) de un informe usá ver_posiciones_informe. " +
      "Solo lee datos, no modifica nada.",
    inputSchema: {
      id_informe: z.string().max(REPORT_ID_LENGTH).optional()
        .describe("ID del informe, por ejemplo '7'"),
      cliente: z.string().max(10).optional()
        .describe("ID del cliente, por ejemplo '121'"),
      estado: z.enum(["OPEN", "SENT", "APPROVED", "REJECTED"]).optional()
        .describe("Estado del informe"),
      fecha_desde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
        .describe("Fecha del informe desde (AAAA-MM-DD)"),
      fecha_hasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
        .describe("Fecha del informe hasta (AAAA-MM-DD)"),
      max_resultados: z.number().int().min(1).max(50).optional()
        .describe("Cantidad máxima de informes (por defecto 20, máximo 50)"),
    },
    annotations: READ_ONLY,
  },
  async (args) => {
    try {
      const filters = [];
      if (args.id_informe) filters.push(reportIdFilter(args.id_informe));
      if (args.cliente) filters.push(`CustomerID eq ${quote(toCustomerId(args.cliente))}`);
      if (args.estado) filters.push(`HeaderStatus eq ${quote(args.estado)}`);
      if (args.fecha_desde) filters.push(`ReportDate ge ${args.fecha_desde}`);
      if (args.fecha_hasta) filters.push(`ReportDate le ${args.fecha_hasta}`);

      const data = await odataGet(buildUrl("ExpenseReport", {
        select: "ReportId,CustomerID,ReportDate,Reason,HeaderStatus,TotalAmount,CurrencyCode,RejectReason",
        filters,
        orderby: "ReportDate desc",
        top: args.max_resultados ?? 20,
      }));

      const wantedId = args.id_informe ? toReportId(args.id_informe) : null;
      const informes = (data.value ?? [])
        .map((r) => ({
          ...r,
          ReportId: String(r.ReportId ?? "").trim(),
          HeaderStatusText: HEADER_STATUS_TEXT[r.HeaderStatus] ?? r.HeaderStatus,
        }))
        .filter((r) => !wantedId || r.ReportId === wantedId); // "7" no debe traer "17"

      const summary = informes.length
        ? `${informes.length} informe(s) encontrado(s).`
        : "No se encontraron informes con esos filtros.";
      return ok(`${summary}\n${JSON.stringify(informes, null, 2)}`);
    } catch (e) {
      return fail("buscar_informes_gastos", e);
    }
  }
);

// ===== Herramienta 2: posiciones de un informe =====
server.registerTool(
  "ver_posiciones_informe",
  {
    title: "Ver posiciones de un informe de gastos",
    description:
      "Devuelve las posiciones (líneas de gasto) de UN informe de gastos de SAP (app ZEXPENSE2), " +
      "con el número de posiciones y la suma de importes por moneda. " +
      "Usala cuando el usuario pida el detalle, las líneas o las posiciones de un informe. " +
      "Tipos de gasto (ExpenseType): HOTEL = hotel, TAXI = taxi/Uber, MEAL = comida, KM = kilometraje. " +
      "Estados de posición (ItemStatus): VALID = válido, PENDING = pendiente de factura, OBSERVED = observado. " +
      "Solo lee datos, no modifica nada.",
    inputSchema: {
      id_informe: z.string().min(1).max(REPORT_ID_LENGTH)
        .describe("ID del informe, por ejemplo '7'"),
    },
    annotations: READ_ONLY,
  },
  async (args) => {
    try {
      const data = await odataGet(buildUrl("ExpenseItem", {
        select: "ReportId,ItemId,ExpenseType,ItemStatus,Vendor,ExpenseDate,Amount,CurrencyCode",
        filters: [reportIdFilter(args.id_informe)],
        orderby: "ItemId asc",
        top: 100,
      }));

      const wantedId = toReportId(args.id_informe);
      const posiciones = (data.value ?? [])
        .filter((p) => String(p.ReportId ?? "").trim() === wantedId)
        .map(({ ReportId, ...p }) => ({
          ...p,
          ItemId: String(p.ItemId ?? "").trim(),
          ExpenseTypeText: EXPENSE_TYPE_TEXT[p.ExpenseType] ?? p.ExpenseType,
          ItemStatusText: ITEM_STATUS_TEXT[p.ItemStatus] ?? p.ItemStatus,
        }));

      if (!posiciones.length) {
        return ok(`El informe ${wantedId} no tiene posiciones (o no existe).`);
      }

      // Suma por moneda (por si hubiera posiciones en monedas distintas)
      const totales = {};
      for (const p of posiciones) {
        totales[p.CurrencyCode] = Math.round(((totales[p.CurrencyCode] ?? 0) + Number(p.Amount ?? 0)) * 100) / 100;
      }
      const totalTxt = Object.entries(totales).map(([cur, sum]) => `${sum} ${cur}`).join(" + ");

      return ok(
        `Informe ${wantedId}: ${posiciones.length} posición(es). Total: ${totalTxt}.\n` +
        JSON.stringify(posiciones, null, 2)
      );
    } catch (e) {
      return fail("ver_posiciones_informe", e);
    }
  }
);

await server.connect(new StdioServerTransport());
console.error("[zexpense2-mcp] Servidor MCP listo (solo lectura, 2 herramientas).");
