import pool from "../config/db.js";

export const CategoriaModel = {
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM categorias");
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM categorias WHERE id = ?", [id]);
    return rows[0] || null;
  },

  create: async ({ nombre, color }) => {
    const [result] = await pool.query(
      "INSERT INTO categorias (nombre, color) VALUES (?, ?)",
      [nombre, color]
    );
    const [rows] = await pool.query("SELECT * FROM categorias WHERE id = ?", [result.insertId]);
    return rows[0];
  },

  update: async (id, { nombre, color }) => {
    const [result] = await pool.query(
      "UPDATE categorias SET nombre = ?, color = ? WHERE id = ?",
      [nombre, color, id]
    );
    if (result.affectedRows === 0) return null;
    const [rows] = await pool.query("SELECT * FROM categorias WHERE id = ?", [id]);
    return rows[0];
  },

  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM categorias WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
