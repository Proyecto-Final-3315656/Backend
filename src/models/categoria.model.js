// ============================================================
// src/models/categoria.model.js (Capa de Modelo = "El Especialista en Datos")
// CRUD sobre la tabla "categorias".
// ============================================================
import pool from "../config/db.js";

export const CategoriaModel = {
  // LEER todos: SELECT de toda la tabla categorias.
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM categorias");
    return rows;
  },

  // LEER uno: busca por id, devuelve una fila o null.
  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM categorias WHERE id = ?", [id]);
    return rows[0] || null;
  },

  // CREAR: INSERT y devuelve el registro recién creado.
  create: async ({ nombre, color }) => {
    const [result] = await pool.query(
      "INSERT INTO categorias (nombre, color) VALUES (?, ?)",
      [nombre, color]
    );
    const [rows] = await pool.query("SELECT * FROM categorias WHERE id = ?", [result.insertId]);
    return rows[0];
  },

  // ACTUALIZAR: UPDATE y retorna el registro actualizado (o null si no existe).
  update: async (id, { nombre, color }) => {
    const [result] = await pool.query(
      "UPDATE categorias SET nombre = ?, color = ? WHERE id = ?",
      [nombre, color, id]
    );
    if (result.affectedRows === 0) return null;
    const [rows] = await pool.query("SELECT * FROM categorias WHERE id = ?", [id]);
    return rows[0];
  },

  // ELIMINAR: DELETE y devuelve true/false según se haya borrado.
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM categorias WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
