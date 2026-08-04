import pool from "../config/db.js";

export const NotaModel = {
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM notas");
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM notas WHERE id = ?", [id]);
    return rows[0] || null;
  },

  create: async ({ contenido, id_tarea, id_usuario }) => {
    const [result] = await pool.query(
      "INSERT INTO notas (contenido, id_tarea, id_usuario) VALUES (?, ?, ?)",
      [contenido, id_tarea, id_usuario]
    );
    const [rows] = await pool.query("SELECT * FROM notas WHERE id = ?", [result.insertId]);
    return rows[0];
  },

  update: async (id, { contenido, id_tarea, id_usuario }) => {
    const [result] = await pool.query(
      "UPDATE notas SET contenido = ?, id_tarea = ?, id_usuario = ? WHERE id = ?",
      [contenido, id_tarea, id_usuario, id]
    );
    if (result.affectedRows === 0) return null;
    const [rows] = await pool.query("SELECT * FROM notas WHERE id = ?", [id]);
    return rows[0];
  },

  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM notas WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
