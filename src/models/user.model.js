import pool from "../database/db.js";

const mapUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const UserModel = {
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM users ORDER BY id ASC");
    return rows.map(mapUser);
  },

  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows.length ? mapUser(rows[0]) : null;
  },

  create: async ({ name, email }) => {
    const [result] = await pool.query(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );
    return UserModel.findById(result.insertId);
  },

  update: async (id, fields) => {
    const user = await UserModel.findById(id);
    if (!user) return null;

    const name = fields.name ?? user.name;
    const email = fields.email ?? user.email;

    await pool.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [
      name,
      email,
      id,
    ]);
    return UserModel.findById(id);
  },

  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
