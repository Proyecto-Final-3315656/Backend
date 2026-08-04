// ============================================================
// src/models/usuario.model.js (Capa de Modelo = "El Especialista en Datos")
// Es la ÚNICA capa que toca la base de datos. Realiza las consultas
// SQL (SELECT/INSERT/UPDATE/DELETE) usando el pool configurado en
// src/config/db.js. Los controladores le piden el trabajo aquí.
//
// "?" en las consultas = parámetro seguro (evita inyección SQL).
// ============================================================

// pool = conexión centralizada a MySQL (de db.js).
import pool from "../config/db.js";

// Exportamos un objeto con los 5 métodos del CRUD.
export const UsuarioModel = {
  // LEER todos: SELECT de toda la tabla "usuarios".
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    return rows; // array con todas las filas
  },

  // LEER uno: busca por id, devuelve una fila o null.
  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
    return rows[0] || null;
  },

  // CREAR: INSERT y retorna el registro recién creado.
  create: async ({ nombre, email, telefono }) => {
    // Insertamos; resultado.insertId trae el id auto generado.
    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email, telefono) VALUES (?, ?, ?)",
      [nombre, email, telefono]
    );
    // Consultamos ese registro para devolverlo completo.
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [result.insertId]);
    return rows[0];
  },

  // ACTUALIZAR: UPDATE y retorna el registro actualizado.
  update: async (id, { nombre, email, telefono }) => {
    const [result] = await pool.query(
      "UPDATE usuarios SET nombre = ?, email = ?, telefono = ? WHERE id = ?",
      [nombre, email, telefono, id]
    );
    // Si no se modificó ninguna fila, el usuario no existe.
    if (result.affectedRows === 0) return null;
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
    return rows[0];
  },

  // ELIMINAR: DELETE y devuelve true/false según se haya borrado.
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
    return result.affectedRows > 0; // true si borró al menos una fila
  },
};