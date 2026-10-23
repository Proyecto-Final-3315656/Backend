import "../src/loadEnv.js";
import bcrypt from "bcryptjs";
import pool from "../src/db/connection.js";
import { validateEnvironment } from "../src/config.js";

validateEnvironment();

const [email, password, nombre = "Administrador"] = process.argv.slice(2);
if (!email || !password || password.length < 12) {
  console.error("Uso: npm run bootstrap:admin -- correo@dominio.com contraseña-segura [nombre]");
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 12);
await pool.query(
  `INSERT INTO users (nombre, email, telefono, password_hash, rol)
   VALUES (?, ?, '', ?, 'admin')
   ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), password_hash = VALUES(password_hash), rol = 'admin'`,
  [nombre, email.toLowerCase(), passwordHash]
);
console.log("Cuenta administradora creada o actualizada.");
await pool.end();
