import pool from "../database/db.js";

const mapTarea = (row) => ({
  id: row.id,
  idUsuario: row.idUsuario,
  nombreUsuario: row.nombreUsuario,
  descripcion: row.descripcion,
  estado: row.estado,
  createdAt: row.createdAt,
  updatedAt: row.updated_at,
});

export const TareaModel = {
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM tareas ORDER BY id ASC");
    return rows.map(mapTarea);
  },

  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM tareas WHERE id = ?", [id]);
    return rows.length ? mapTarea(rows[0]) : null;
  },

  findByUserId: async (userId) => {
    const [rows] = await pool.query(
      "SELECT * FROM tareas WHERE idUsuario = ? ORDER BY id ASC",
      [userId]
    );
    return rows.map(mapTarea);
  },

  create: async ({ idUsuario, nombreUsuario, descripcion, estado }) => {
    const [result] = await pool.query(
      "INSERT INTO tareas (idUsuario, nombreUsuario, descripcion, estado) VALUES (?, ?, ?, ?)",
      [idUsuario, nombreUsuario || "", descripcion, estado || "Pendiente"]
    );
    return TareaModel.findById(result.insertId);
  },

  update: async (id, fields) => {
    const tarea = await TareaModel.findById(id);
    if (!tarea) return null;

    const idUsuario = fields.idUsuario ?? tarea.idUsuario;
    const nombreUsuario = fields.nombreUsuario ?? tarea.nombreUsuario;
    const descripcion = fields.descripcion ?? tarea.descripcion;
    const estado = fields.estado ?? tarea.estado;

    await pool.query(
      "UPDATE tareas SET idUsuario = ?, nombreUsuario = ?, descripcion = ?, estado = ? WHERE id = ?",
      [idUsuario, nombreUsuario, descripcion, estado, id]
    );
    return TareaModel.findById(id);
  },

  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM tareas WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
