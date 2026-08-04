// ============================================================
// src/models/user.model.js (Capa de Modelo = "El Especialista en Datos")
// Variante de ejemplo sobre la tabla "users". Aplica el mismo
// patrón CRUD que usuario.model.js pero con columnas name/email.
// ============================================================
import pool from "../config/db.js";

export const UserModel = {
  // LEER todos: SELECT de toda la tabla "users".
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
  },

  // LEER uno: busca por id, devuelve una fila o null.
  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0] || null;
  },

  // CREAR: INSERT y retorna el registro recién creado.
  create: async ({ name, email }) => {
    const [result] = await pool.query(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [result.insertId]);
    return rows[0];
  },

  // ACTUALIZAR: UPDATE y retorna el registro actualizado.
  update: async (id, { name, email }) => {
    const [result] = await pool.query(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, id]
    );
    if (result.affectedRows === 0) return null;
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  },

  // ELIMINAR: DELETE y devuelve true/false según se haya borrado.
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
