import pool from "../config/db.js";

export const TareaModel = {
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM tareas");
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM tareas WHERE id = ?", [id]);
    return rows[0] || null;
  },

  findByUsuario: async (idUsuario) => {
    const [rows] = await pool.query("SELECT * FROM tareas WHERE idUsuario = ?", [idUsuario]);
    return rows;
  },

  findByProyecto: async (idProyecto) => {
    const [rows] = await pool.query("SELECT * FROM tareas WHERE id_proyecto = ?", [idProyecto]);
    return rows;
  },

  create: async ({ titulo, descripcion, estado, id_proyecto, idUsuario, nombreUsuario }) => {
    const [result] = await pool.query(
      "INSERT INTO tareas (idUsuario, nombreUsuario, titulo, descripcion, estado, id_proyecto) VALUES (?, ?, ?, ?, ?, ?)",
      [idUsuario || null, nombreUsuario || null, titulo, descripcion, estado || "Pendiente", id_proyecto || null]
    );
    const [rows] = await pool.query("SELECT * FROM tareas WHERE id = ?", [result.insertId]);
    return rows[0];
  },

  update: async (id, fields) => {
    const allowed = ["idUsuario", "nombreUsuario", "titulo", "descripcion", "estado", "id_proyecto"];
    const columns = [];
    const values = [];

    for (const key of allowed) {
      if (fields[key] !== undefined) {
        columns.push(`${key} = ?`);
        values.push(fields[key]);
      }
    }

    if (columns.length === 0) return null;

    values.push(id);
    const [result] = await pool.query(
      `UPDATE tareas SET ${columns.join(", ")} WHERE id = ?`,
      values
    );
    if (result.affectedRows === 0) return null;
    const [rows] = await pool.query("SELECT * FROM tareas WHERE id = ?", [id]);
    return rows[0];
  },

  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM tareas WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
