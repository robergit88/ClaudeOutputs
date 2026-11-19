// "npm run register": agrega este servidor MCP a la configuración de Claude Desktop.
// - Respeta todo lo que ya haya en el archivo (solo agrega/actualiza "zexpense2").
// - Antes de tocar nada, guarda una copia de seguridad (.bak).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appData = process.env.APPDATA;
if (!appData) {
  console.error("No encuentro la variable APPDATA (¿estás en Windows?).");
  process.exit(1);
}

const configDir = path.join(appData, "Claude");
const configFile = path.join(configDir, "claude_desktop_config.json");
const serverScript = path.join(path.dirname(fileURLToPath(import.meta.url)), "index.js");

let config = {};
if (fs.existsSync(configFile)) {
  const raw = fs.readFileSync(configFile, "utf8").trim();
  if (raw) {
    try {
      config = JSON.parse(raw);
    } catch (e) {
      console.error(`El archivo ${configFile} no es un JSON válido. No toco nada.\n${e.message}`);
      process.exit(1);
    }
  }
  fs.copyFileSync(configFile, `${configFile}.bak`);
  console.log(`Copia de seguridad: ${configFile}.bak`);
} else {
  fs.mkdirSync(configDir, { recursive: true });
}

config.mcpServers ??= {};
config.mcpServers.zexpense2 = { command: "node", args: [serverScript] };

fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
console.log(`Servidor "zexpense2" registrado en ${configFile}`);
console.log("Ahora cerrá Claude Desktop del todo (también desde el icono junto al reloj) y volvé a abrirlo.");
