import pool from "../db/connection.js";

export const UserModel = {
  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, telefono FROM users ORDER BY id"
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, telefono FROM users WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  getById: async (id) => {
    return UserModel.findById(id);
  },

  create: async ({ nombre, email, telefono }) => {
    const [result] = await pool.query(
      "INSERT INTO users (nombre, email, telefono) VALUES (?, ?, ?)",
      [nombre, email, telefono || ""]
    );
    return { id: result.insertId, nombre, email, telefono: telefono || "" };
  },

  delete: async (id) => {
    const user = await UserModel.findById(id);
    if (!user) return false;

    const [tareas] = await pool.query(
      "SELECT COUNT(*) AS total FROM tareas WHERE idUsuario = ?",
      [id]
    );
    if (tareas[0].total > 0) {
      return { deleted: false, message: "El usuario tiene tareas vinculadas" };
    }

    await pool.query("DELETE FROM users WHERE id = ?", [id]);
    return { deleted: true, message: "Usuario eliminado" };
  },
};
