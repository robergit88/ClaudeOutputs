// Login manual: "npm run login".
// Útil la primera vez, o cuando vence el refresh token,
// para no tener que hacer el login en medio de una charla con Claude.
import { forceLogin } from "./auth.js";

try {
  await forceLogin();
  console.log("Login correcto. Tokens guardados en .tokens.json");
  process.exit(0);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
