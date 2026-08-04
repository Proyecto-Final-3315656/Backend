import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "tareas_adso",
  waitForConnections: true,
  connectionLimit: 10,
});

export const verifyConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Conexion a la base de datos exitosa");
    connection.release();
    return true;
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error.message);
    return false;
  }
};

export default pool;
