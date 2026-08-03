import pool from "../database/db.js";
import usersData from "../data/users.data.js";
import tareasData from "../data/tareas.data.js";

const seed = async () => {
  console.log("Sembrando datos iniciales en MySQL...");

  for (const user of usersData) {
    await pool.query(
      "INSERT INTO users (id, name, email) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email)",
      [user.id, user.name, user.email]
    );
  }

  for (const tarea of tareasData) {
    const createdAt = new Date(tarea.createdAt)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    await pool.query(
      "INSERT INTO tareas (id, idUsuario, nombreUsuario, descripcion, estado, createdAt) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion), estado = VALUES(estado)",
      [
        tarea.id,
        tarea.idUsuario,
        tarea.nombreUsuario,
        tarea.descripcion,
        tarea.estado,
        createdAt,
      ]
    );
  }

  console.log("Seed completado: usuarios y tareas insertados.");
  await pool.end();
};

seed().catch((error) => {
  console.error("Error al sembrar:", error.message);
  process.exit(1);
});
