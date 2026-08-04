// ============================================================
// src/models/tarea.model.js (Capa de Modelo = "Especialista en Datos")
// Única capa que ejecuta SQL sobre la tabla "tareas".
// Tiene métodos extra: findByUsuario y findByProyecto (filtros) y
// un update dinámico que solo actualiza los campos enviados.
// ============================================================
import pool from "../config/db.js";

export const TareaModel = {
  // LEER todos: SELECT de toda la tabla tareas (usa ? parametrizado en filtros).
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM tareas");
    return rows; // array con todas las tareas
  },

  // LEER una: busca por id, devuelve una fila o null.
  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM tareas WHERE id = ?", [id]);
    return rows[0] || null;
  },

  // LEER filtradas: por idUsuario (para el Kanban / tabla).
  findByUsuario: async (idUsuario) => {
    const [rows] = await pool.query("SELECT * FROM tareas WHERE idUsuario = ?", [idUsuario]);
    return rows;
  },

  // LEER filtradas: por proyecto.
  findByProyecto: async (idProyecto) => {
    const [rows] = await pool.query("SELECT * FROM tareas WHERE id_proyecto = ?", [idProyecto]);
    return rows;
  },

  // CREAR: INSERT de una tarea y devuelve el registro creado.
  create: async ({ titulo, descripcion, estado, id_proyecto, idUsuario, nombreUsuario }) => {
    // resultado.insertId trae el id auto-generado.
    const [result] = await pool.query(
      "INSERT INTO tareas (idUsuario, nombreUsuario, titulo, descripcion, estado, id_proyecto) VALUES (?, ?, ?, ?, ?, ?)",
      [idUsuario || null, nombreUsuario || null, titulo, descripcion, estado || "Pendiente", id_proyecto || null]
    );
    const [rows] = await pool.query("SELECT * FROM tareas WHERE id = ?", [result.insertId]);
    return rows[0];
  },

  // ACTUALIZAR: solo los campos enviados (whitelist) -> PATCH parcial.
  update: async (id, fields) => {
    const allowed = ["idUsuario", "nombreUsuario", "titulo", "descripcion", "estado", "id_proyecto"];
    const columns = [];
    const values = [];

    for (const key of allowed) {        // recorre la whitelist
      if (fields[key] !== undefined) {  // solo el campo recibido se actualiza
        columns.push(`${key} = ?`);
        values.push(fields[key]);
      }
    }

    if (columns.length === 0) return null; // nada que actualizar

    values.push(id);                       // siempre al final del WHERE
    const [result] = await pool.query(
      `UPDATE tareas SET ${columns.join(", ")} WHERE id = ?`,
      values
    );
    if (result.affectedRows === 0) return null; // no existía
    const [rows] = await pool.query("SELECT * FROM tareas WHERE id = ?", [id]);
    return rows[0];
  },

  // ELIMINAR: DELETE y devuelve true/false según se haya borrado.
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM tareas WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },

  // ELIMINAR POR USUARIO: DELETE de todas las tareas de un idUsuario (cascada).
  // Usado al borrar un usuario para que sus tareas no queden huérfanas.
  deleteByUsuario: async (idUsuario) => {
    const [result] = await pool.query("DELETE FROM tareas WHERE idUsuario = ?", [idUsuario]);
    return true; // siempre true: el borrado en cascada no es "error" si no había tareas
  },
};
