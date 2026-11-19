// Servidor MCP de SOLO LECTURA sobre la API web ZEXPENSE2.
// Herramienta única: buscar_informes_gastos -> GET ExpenseReport (cabecera).
//
// Importante: en un servidor MCP por stdio, la salida estándar (stdout) es
// el canal del protocolo. Los mensajes de log van siempre por console.error.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { config } from "./config.js";
import { getAccessToken, invalidateAccessToken } from "./auth.js";

const ENTITY = "ExpenseReport";
const REPORT_ID_LENGTH = 10;   // report_id : abap.char(10), alineado a la derecha con ESPACIOS ("        7")
const SELECT = [
  "ReportId", "CustomerID", "ReportDate", "Reason",
  "HeaderStatus", "TotalAmount", "CurrencyCode", "RejectReason",
].join(",");

const STATUS_TEXT = {
  OPEN: "Abierta",
  SENT: "Enviada",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
};

// ---------- helpers OData ----------
const quote = (s) => `'${String(s).replace(/'/g, "''")}'`;
// El ReportId está guardado alineado a la derecha con espacios ("        7").
// Para no depender de cuántos espacios hay, se filtra con endswith(...)
// en OData y luego se compara exacto, sin espacios, en el programa.
// "7" o "0000000007" -> "7"
const toReportId = (value) => {
  const v = String(value).trim();
  return /^\d+$/.test(v) ? String(Number(v)) : v;
};
// "000121" -> "121" (el CustomerID viene sin ceros a la izquierda)
const toCustomerId = (value) => {
  const v = String(value).trim();
  return /^\d+$/.test(v) ? String(Number(v)) : v;
};

function buildUrl(args) {
  const filters = [];
  if (args.id_informe) filters.push(`endswith(ReportId,${quote(toReportId(args.id_informe))})`);
  if (args.cliente) filters.push(`CustomerID eq ${quote(toCustomerId(args.cliente))}`);
  if (args.estado) filters.push(`HeaderStatus eq ${quote(args.estado)}`);
  if (args.fecha_desde) filters.push(`ReportDate ge ${args.fecha_desde}`);
  if (args.fecha_hasta) filters.push(`ReportDate le ${args.fecha_hasta}`);

  const params = new URLSearchParams();
  params.set("$select", SELECT);
  if (filters.length) params.set("$filter", filters.join(" and "));
  params.set("$orderby", "ReportDate desc");
  params.set("$top", String(args.max_resultados ?? 20));
  if (config.sapClient) params.set("sap-client", config.sapClient);

  return `${config.serviceUrl}${ENTITY}?${params.toString().replace(/\+/g, "%20")}`;
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

// ---------- servidor MCP ----------
const server = new McpServer({ name: "zexpense2", version: "0.1.0" });

server.registerTool(
  "buscar_informes_gastos",
  {
    title: "Buscar informes de gastos",
    description:
      "Busca cabeceras de informes de gastos en SAP (app ZEXPENSE2). " +
      "Usala cuando el usuario pregunte por sus informes de gastos, estados, importes o fechas. " +
      "Estados: OPEN = abierta (todavía no enviada), SENT = enviada (pendiente de aprobación), " +
      "APPROVED = aprobada, REJECTED = rechazada (ver RejectReason). " +
      "Sin filtros devuelve los más recientes. Solo lee datos, no modifica nada.",
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
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  async (args) => {
    try {
      const data = await odataGet(buildUrl(args));
      const wantedId = args.id_informe ? toReportId(args.id_informe) : null;
      const informes = (data.value ?? [])
        .map((r) => ({
          ...r,
          ReportId: String(r.ReportId ?? "").trim(),
          HeaderStatusText: STATUS_TEXT[r.HeaderStatus] ?? r.HeaderStatus,
        }))
        .filter((r) => !wantedId || r.ReportId === wantedId); // "7" no debe traer "17"
      const summary = informes.length
        ? `${informes.length} informe(s) encontrado(s).`
        : "No se encontraron informes con esos filtros.";
      return {
        content: [{ type: "text", text: `${summary}\n${JSON.stringify(informes, null, 2)}` }],
      };
    } catch (e) {
      console.error(`[buscar_informes_gastos] ${e.message}`);
      return { isError: true, content: [{ type: "text", text: e.message }] };
    }
  }
);

await server.connect(new StdioServerTransport());
console.error("[zexpense2-mcp] Servidor MCP listo (solo lectura).");
