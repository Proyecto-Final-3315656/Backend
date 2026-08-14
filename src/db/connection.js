// ============================================================
// src/db/connection.js - Pool de conexiones a MySQL
// Lee la configuración desde el archivo .env (ver .env.example).
// ============================================================
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "tareas_adso",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

// Prueba la conexión a MySQL al arrancar y muestra un mensaje claro.
// Si no puede conectar, el fallo NO es silencioso: imprime el error
// exacto y detiene el proceso para que sea imposible pasar por alto.
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT DATABASE() AS db, CURRENT_USER() AS user"
    );
    console.log(
      `[BD] Conexion OK -> Base: ${rows[0].db} | Usuario: ${rows[0].user} | Host: ${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || 3306}`
    );
    connection.release();
  } catch (error) {
    console.error("[BD] ERROR al conectar a MySQL:");
    console.error(`  Codigo: ${error.code || error.errno || "desconocido"}`);
    console.error(`  Mensaje: ${error.sqlMessage || error.message}`);
    console.error(
      "  Revisa que MySQL este encendido y que el .env tenga las credenciales correctas (DB_USER / DB_PASSWORD / DB_NAME)."
    );
    process.exit(1);
  }
}

export default pool;
