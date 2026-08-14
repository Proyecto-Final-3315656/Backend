// ============================================================
// src/loadEnv.js - Carga las variables del .env con RUTA ABSOLUTA.
// DEBE ser el primer import de server.js: como los imports de ESM se
// evalúan en orden, aquí el .env queda cargado ANTES de que app.js y
// connection.js lean process.env. Así funciona sin importar desde qué
// carpeta se abra la terminal.
// ============================================================
import { config } from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

config({ path: path.join(__dirname, "..", ".env") });
