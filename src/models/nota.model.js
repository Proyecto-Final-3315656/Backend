// ============================================================
// src/models/nota.model.js (Capa de Modelo = "El Especialista en Datos")
// CRUD sobre la tabla "notas".
// ============================================================
import pool from "../config/db.js";

export const NotaModel = {
  // LEER todos: SELECT de toda la tabla notas.
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM notas");
    return rows;
  },

  // LEER uno: busca por id, devuelve una fila o null.
  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM notas WHERE id = ?", [id]);
    return rows[0] || null;
  },

  // CREAR: INSERT y devuelve el registro recién creado.
  create: async ({ contenido, id_tarea, id_usuario }) => {
    const [result] = await pool.query(
      "INSERT INTO notas (contenido, id_tarea, id_usuario) VALUES (?, ?, ?)",
      [contenido, id_tarea, id_usuario]
    );
    const [rows] = await pool.query("SELECT * FROM notas WHERE id = ?", [result.insertId]);
    return rows[0];
  },

  // ACTUALIZAR: UPDATE y retorna el registro actualizado (o null si no existe).
  update: async (id, { contenido, id_tarea, id_usuario }) => {
    const [result] = await pool.query(
      "UPDATE notas SET contenido = ?, id_tarea = ?, id_usuario = ? WHERE id = ?",
      [contenido, id_tarea, id_usuario, id]
    );
    if (result.affectedRows === 0) return null;
    const [rows] = await pool.query("SELECT * FROM notas WHERE id = ?", [id]);
    return rows[0];
  },

  // ELIMINAR: DELETE y devuelve true/false según se haya borrado.
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM notas WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
