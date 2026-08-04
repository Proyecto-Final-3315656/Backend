import pool from "../config/db.js";

export const UsuarioModel = {
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
    return rows[0] || null;
  },

  create: async ({ nombre, email, telefono }) => {
    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email, telefono) VALUES (?, ?, ?)",
      [nombre, email, telefono]
    );
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [result.insertId]);
    return rows[0];
  },

  update: async (id, { nombre, email, telefono }) => {
    const [result] = await pool.query(
      "UPDATE usuarios SET nombre = ?, email = ?, telefono = ? WHERE id = ?",
      [nombre, email, telefono, id]
    );
    if (result.affectedRows === 0) return null;
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
    return rows[0];
  },

  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
