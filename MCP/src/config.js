// Lee la configuración del archivo .env (en la raíz del proyecto).
// Claude Desktop no arranca el programa desde esta carpeta, por eso
// las rutas se calculan a partir de la ubicación de este archivo.
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENV_FILE = path.join(ROOT, ".env");

if (!fs.existsSync(ENV_FILE)) {
  throw new Error(`No encuentro ${ENV_FILE}. Copiá .env.example como .env y completalo.`);
}
process.loadEnvFile(ENV_FILE);

function required(name) {
  const value = process.env[name];
  if (!value || value.startsWith("PEGAR_AQUI")) {
    throw new Error(`Falta la variable ${name} en el archivo .env`);
  }
  return value.trim();
}

export const config = {
  authUrl: required("AUTH_URL"),
  tokenUrl: required("TOKEN_URL"),
  clientId: required("CLIENT_ID"),
  clientSecret: required("CLIENT_SECRET"),
  callbackUrl: required("CALLBACK_URL"),
  serviceUrl: required("SERVICE_URL").replace(/\/?$/, "/"),
  sapClient: process.env.SAP_CLIENT?.trim() || "",
  tokensFile: path.join(ROOT, ".tokens.json"),
};
