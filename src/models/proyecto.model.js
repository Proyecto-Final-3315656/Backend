import pool from "../config/db.js";

export const ProyectoModel = {
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM proyectos");
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM proyectos WHERE id = ?", [id]);
    return rows[0] || null;
  },

  create: async ({ nombre, descripcion, id_usuario }) => {
    const [result] = await pool.query(
      "INSERT INTO proyectos (nombre, descripcion, id_usuario) VALUES (?, ?, ?)",
      [nombre, descripcion, id_usuario]
    );
    const [rows] = await pool.query("SELECT * FROM proyectos WHERE id = ?", [result.insertId]);
    return rows[0];
  },

  update: async (id, { nombre, descripcion, id_usuario }) => {
    const [result] = await pool.query(
      "UPDATE proyectos SET nombre = ?, descripcion = ?, id_usuario = ? WHERE id = ?",
      [nombre, descripcion, id_usuario, id]
    );
    if (result.affectedRows === 0) return null;
    const [rows] = await pool.query("SELECT * FROM proyectos WHERE id = ?", [id]);
    return rows[0];
  },

  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM proyectos WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
