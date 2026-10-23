import pool from "../db/connection.js";

export const UserModel = {
  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, telefono, rol FROM users ORDER BY id"
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, telefono, rol FROM users WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  getById: async (id) => {
    return UserModel.findById(id);
  },

  findByEmailWithPassword: async (email) => {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, telefono, password_hash AS passwordHash, rol FROM users WHERE email = ?",
      [email]
    );
    return rows[0] || null;
  },

  create: async ({ nombre, email, telefono, passwordHash, rol }) => {
    const [result] = await pool.query(
      "INSERT INTO users (nombre, email, telefono, password_hash, rol) VALUES (?, ?, ?, ?, ?)",
      [nombre, email, telefono || "", passwordHash, rol]
    );
    return UserModel.findById(result.insertId);
  },

  update: async (id, fields) => {
    const allowed = ["nombre", "email", "telefono", "rol"];
    const entries = Object.entries(fields).filter(([key]) => allowed.includes(key));
    if (entries.length === 0) return null;
    const setClause = entries.map(([key]) => `${key} = ?`).join(", ");
    const [result] = await pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, [...entries.map(([, value]) => value), id]);
    return result.affectedRows ? UserModel.findById(id) : null;
  },

  delete: async (id) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.query("DELETE FROM users WHERE id = ?", [id]);
      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};
