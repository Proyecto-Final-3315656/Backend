import "../src/loadEnv.js";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function hasColumn(table, column) {
  const [rows] = await connection.query(
    `SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?`,
    [table, column]
  );
  return rows.length > 0;
}

async function hasIndex(table, index) {
  const [rows] = await connection.query(`SHOW INDEX FROM ${table} WHERE Key_name = ?`, [index]);
  return rows.length > 0;
}

async function hasForeignKey(name) {
  const [rows] = await connection.query(
    `SELECT 1 FROM information_schema.table_constraints WHERE table_schema = DATABASE() AND table_name = 'tareas' AND constraint_name = ? AND constraint_type = 'FOREIGN KEY'`,
    [name]
  );
  return rows.length > 0;
}

try {
  if (!(await hasColumn("users", "password_hash"))) {
    await connection.query("ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL AFTER telefono");
  }
  if (!(await hasColumn("users", "rol"))) {
    await connection.query("ALTER TABLE users ADD COLUMN rol ENUM('admin', 'usuario') NOT NULL DEFAULT 'usuario' AFTER password_hash");
  }
  if (!(await hasIndex("users", "uq_users_email"))) {
    const [duplicates] = await connection.query("SELECT email FROM users GROUP BY email HAVING COUNT(*) > 1");
    if (duplicates.length) throw new Error("No se puede crear la unicidad de email: hay correos duplicados.");
    await connection.query("ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email)");
  }
  if (await hasColumn("tareas", "nombreUsuario")) {
    await connection.query("ALTER TABLE tareas DROP COLUMN nombreUsuario");
  }
  if (await hasForeignKey("fk_tarea_usuario")) {
    await connection.query("ALTER TABLE tareas DROP FOREIGN KEY fk_tarea_usuario");
  }
  if (!(await hasForeignKey("fk_tarea_usuario"))) {
    await connection.query("ALTER TABLE tareas ADD CONSTRAINT fk_tarea_usuario FOREIGN KEY (idUsuario) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE");
  }
  console.log("Migración de seguridad aplicada correctamente.");
} finally {
  await connection.end();
}
