import pool from "../db/connection.js";

const CAMPOS_ACTUALIZABLES = ["descripcion", "estado"];

// Normaliza una fecha a formato MySQL: 'YYYY-MM-DD HH:MM:SS'
function fechaSql(valor) {
  const fecha = valor ? new Date(valor) : new Date();
  return fecha.toISOString().slice(0, 19).replace("T", " ");
}

export const TareaModel = {
  findAll: async () => {
    const [rows] = await pool.query(
      `SELECT t.id, t.idUsuario, u.nombre AS nombreUsuario, t.descripcion, t.estado, t.createdAt
       FROM tareas t INNER JOIN users u ON u.id = t.idUsuario ORDER BY t.id`
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      `SELECT t.id, t.idUsuario, u.nombre AS nombreUsuario, t.descripcion, t.estado, t.createdAt
       FROM tareas t INNER JOIN users u ON u.id = t.idUsuario WHERE t.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  findByUserId: async (idUsuario) => {
    const [rows] = await pool.query(
      `SELECT t.id, t.idUsuario, u.nombre AS nombreUsuario, t.descripcion, t.estado, t.createdAt
       FROM tareas t INNER JOIN users u ON u.id = t.idUsuario WHERE t.idUsuario = ? ORDER BY t.id`,
      [idUsuario]
    );
    return rows;
  },

  create: async ({ idUsuario, descripcion, estado, createdAt }) => {
    const [result] = await pool.query(
      "INSERT INTO tareas (idUsuario, descripcion, estado, createdAt) VALUES (?, ?, ?, ?)",
      [
        idUsuario,
        descripcion,
        estado || "Pendiente",
        fechaSql(createdAt),
      ]
    );
    return TareaModel.findById(result.insertId);
  },

  update: async (id, updatedFields) => {
    const fieldsToUpdate = {};
    for (const campo of CAMPOS_ACTUALIZABLES) {
      if (updatedFields[campo] !== undefined) {
        fieldsToUpdate[campo] = updatedFields[campo];
      }
    }

    if (Object.keys(fieldsToUpdate).length === 0) return null;

    const setClause = Object.keys(fieldsToUpdate)
      .map((f) => `${f} = ?`)
      .join(", ");
    await pool.query(`UPDATE tareas SET ${setClause} WHERE id = ?`, [
      ...Object.values(fieldsToUpdate),
      id,
    ]);
    return TareaModel.findById(id);
  },

  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM tareas WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },

  belongsToUser: async (id, userId) => {
    const [rows] = await pool.query("SELECT id FROM tareas WHERE id = ? AND idUsuario = ?", [id, userId]);
    return rows.length > 0;
  },
};
