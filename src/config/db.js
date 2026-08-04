// ============================================================
// src/config/db.js (Configuración de la Base de Datos)
// Esta capa CREA el "pool" de conexiones a MySQL y se encarga de
// que la base de datos exista. Todos los modelos usan este archivo
// para hablar con la base de datos de forma centralizada.
// ============================================================

// mysql2/promise: cliente de MySQL que soporta async/await.
import mysql from "mysql2/promise";

// dotenv: lee las variables de configuracion desde el archivo .env
// (host, usuario, contraseña, nombre de BD) y las carga en process.env.
import dotenv from "dotenv";
dotenv.config();

// ---- Configuración base (sin elegir aún una base de datos) ----
// Se usa para conectarse a MySQL y luego crear la base si hace falta.
const dbConfig = {
  host: process.env.DB_HOST || "localhost",   // donde vive MySQL
  port: process.env.DB_PORT || 3306,          // puerto por defecto de MySQL
  user: process.env.DB_USER || "root",        // usuario (viene del .env)
  password: process.env.DB_PASSWORD || "",    // contraseña (viene del .env)
  waitForConnections: true,                   // espera si no hay conexiones libres
  connectionLimit: 10,                        // máximo de 10 conexiones a la vez
};

// ---- Pool principal (ya apuntando a la base concreta) ----
// Un "pool" administra varias conexiones reutilizables, más eficiente
// que abrir y cerrar una conexión en cada petición.
const pool = mysql.createPool({
  ...dbConfig,                                 // hereda la config base
  database: process.env.DB_NAME || "tareas_adso", // la base en la que trabajamos
});

// ---- Función: crear la base de datos si aún no existe ----
// Conecta SIN seleccionar base, ejecuta CREATE DATABASE IF NOT EXISTS
// y cierra la conexión temporal. Garantiza que la BD exista al arrancar.
const ensureDatabase = async () => {
  const connection = await mysql.createConnection(dbConfig);
  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`Base de datos "${process.env.DB_NAME}" verificada/creada`);
  } finally {
    await connection.end(); // cerramos la conexión temporal siempre
  }
};

// ---- Función: verificar que la conexión funciona ----
// La usa server.js antes de arrancar. Devuelve true si hubo conexión.
export const verifyConnection = async () => {
  try {
    await ensureDatabase();              // 1. aseguramos que exista la BD
    const connection = await pool.getConnection(); // 2. tomamos una conexión
    console.log("Conexion a la base de datos exitosa");
    connection.release();                // 3. la devolvemos al pool
    return true;
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error.message);
    return false;
  }
};

// Exportamos el pool para que los modelos puedan consultar la BD.
export default pool;