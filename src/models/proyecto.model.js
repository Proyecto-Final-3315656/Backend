// ============================================================
// src/models/proyecto.model.js (Capa de Modelo = "El Especialista en Datos")
// CRUD sobre la tabla "proyectos". Solo capa de datos; los controladores
// son la entrada. Usa pool de db.js y parámetros "?" para evitar inyección.
// ============================================================
import pool from "../config/db.js";

export const ProyectoModel = {
  // LEER todos: SELECT de toda la tabla proyectos.
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM proyectos");
    return rows;
  },

  // LEER uno: busca por id, devuelve una fila o null.
  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM proyectos WHERE id = ?", [id]);
    return rows[0] || null;
  },

  // CREAR: INSERT y devuelve el registro recién creado.
  create: async ({ nombre, descripcion, id_usuario }) => {
    const [result] = await pool.query(
      "INSERT INTO proyectos (nombre, descripcion, id_usuario) VALUES (?, ?, ?)",
      [nombre, descripcion, id_usuario]
    );
    // Re-consulta para devolver el row completo.
    const [rows] = await pool.query("SELECT * FROM proyectos WHERE id = ?", [result.insertId]);
    return rows[0];
  },

  // ACTUALIZAR: UPDATE y retorna el registro actualizado (o null si no existe).
  update: async (id, { nombre, descripcion, id_usuario }) => {
    const [result] = await pool.query(
      "UPDATE proyectos SET nombre = ?, descripcion = ?, id_usuario = ? WHERE id = ?",
      [nombre, descripcion, id_usuario, id]
    );
    if (result.affectedRows === 0) return null;
    const [rows] = await pool.query("SELECT * FROM proyectos WHERE id = ?", [id]);
    return rows[0];
  },

  // ELIMINAR: DELETE y devuelve true/false según se haya borrado.
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM proyectos WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
