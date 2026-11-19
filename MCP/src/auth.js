// Autenticación OAuth 2.0 - Authorization Code + refresh token.
//
// 1ª vez: abre el navegador con el login de SAP, recibe el "code" en
//         http://localhost:8080 y lo cambia por access + refresh token.
// Después: renueva el access token con el refresh token, sin molestar.
// Los tokens se guardan en .tokens.json (está en .gitignore).
import http from "node:http";
import fs from "node:fs";
import open from "open";
import { config } from "./config.js";

const LOGIN_TIMEOUT_MS = 3 * 60 * 1000;
const EXPIRY_MARGIN_MS = 60 * 1000;

let tokens = loadTokens();
let pending = null; // evita dos logins/refresh a la vez

function loadTokens() {
  try {
    return JSON.parse(fs.readFileSync(config.tokensFile, "utf8"));
  } catch {
    return null;
  }
}

function saveTokens(data) {
  tokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token ?? tokens?.refresh_token,
    expires_at: Date.now() + (data.expires_in ?? 600) * 1000,
  };
  fs.writeFileSync(config.tokensFile, JSON.stringify(tokens, null, 2));
}

async function requestToken(params) {
  const basic = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");
  const res = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams(params),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error pidiendo token (${res.status}): ${text.slice(0, 300)}`);
  }
  saveTokens(await res.json());
}

async function refresh() {
  await requestToken({ grant_type: "refresh_token", refresh_token: tokens.refresh_token });
}

function interactiveLogin() {
  const callback = new URL(config.callbackUrl);
  const authorizeUrl = new URL(config.authUrl);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", config.clientId);
  authorizeUrl.searchParams.set("redirect_uri", config.callbackUrl);

  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url, config.callbackUrl);
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");
      if (!code && !error) {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(code
        ? "<h2>Login correcto. Ya podés cerrar esta ventana.</h2>"
        : `<h2>Error en el login: ${error}</h2>`);
      clearTimeout(timer);
      server.close();
      if (error) return reject(new Error(`Login rechazado: ${error}`));
      try {
        await requestToken({ grant_type: "authorization_code", code, redirect_uri: config.callbackUrl });
        resolve();
      } catch (e) {
        reject(e);
      }
    });

    const timer = setTimeout(() => {
      server.close();
      reject(new Error("Tiempo de login agotado (3 minutos). Probá con: npm run login"));
    }, LOGIN_TIMEOUT_MS);

    server.on("error", (e) => {
      clearTimeout(timer);
      reject(new Error(`No pude abrir ${config.callbackUrl}: ${e.message}`));
    });

    server.listen(Number(callback.port) || 80, callback.hostname, () => {
      console.error(`[auth] Abriendo el navegador para el login de SAP...`);
      open(authorizeUrl.toString()).catch(() => {
        console.error(`[auth] Abrí esta URL a mano: ${authorizeUrl}`);
      });
    });
  });
}

/** Devuelve un access token válido (renueva o pide login si hace falta). */
export async function getAccessToken() {
  if (tokens?.access_token && Date.now() < tokens.expires_at - EXPIRY_MARGIN_MS) {
    return tokens.access_token;
  }
  if (!pending) {
    pending = (async () => {
      if (tokens?.refresh_token) {
        try {
          await refresh();
          return;
        } catch (e) {
          console.error(`[auth] Refresh falló, hace falta login: ${e.message}`);
        }
      }
      await interactiveLogin();
    })().finally(() => { pending = null; });
  }
  await pending;
  return tokens.access_token;
}

/** Marca el access token como vencido (por ejemplo tras un 401). */
export function invalidateAccessToken() {
  if (tokens) tokens.expires_at = 0;
}

/** Fuerza un login nuevo en el navegador (lo usa "npm run login"). */
export async function forceLogin() {
  tokens = null;
  await interactiveLogin();
}
