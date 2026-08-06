const TareasDeleteModel = {
  findAll: async () => {
    const sql = "SELECT * FROM tareas";
    // Flujo: pool.query(sql) → [rows] → devuelve todas las tareas
    return { sql, descripcion: "Obtiene todas las tareas de la tabla tareas" };
  },

  findById: async (id) => {
    const sql = "SELECT * FROM tareas WHERE id = ?";
    // Flujo: pool.query(sql, [id]) → [rows] → rows[0] || null
    return { sql, params: [id], descripcion: "Busca una tarea por su ID primario" };
  },

  getById: async (id) => {
    return TareasDeleteModel.findById(id);
  },

  findByUserId: async (idUsuario) => {
    const sql = "SELECT * FROM tareas WHERE idUsuario = ?";
    // Flujo: pool.query(sql, [idUsuario]) → [rows] → tareas del usuario
    return { sql, params: [idUsuario], descripcion: "Filtra tareas por ID de usuario" };
  },

  create: async (newTarea) => {
    const { idUsuario, nombreUsuario, descripcion, estado } = newTarea;
    const sql =
      "INSERT INTO tareas (idUsuario, nombreUsuario, descripcion, estado) VALUES (?, ?, ?, ?)";
    const params = [idUsuario, nombreUsuario, descripcion, estado || "Pendiente"];
    // Flujo: pool.query(sql, params) → result.insertId → findById(insertId)
    return { sql, params, descripcion: "Inserta una nueva tarea y devuelve el registro creado" };
  },

  update: async (id, updatedFields) => {
    const allowedFields = ["idUsuario", "nombreUsuario", "descripcion", "estado"];
    const fieldsToUpdate = {};
    for (const field of allowedFields) {
      if (updatedFields[field] !== undefined) {
        fieldsToUpdate[field] = updatedFields[field];
      }
    }

    if (Object.keys(fieldsToUpdate).length === 0) return null;

    const setClause = Object.keys(fieldsToUpdate)
      .map((f) => `${f} = ?`)
      .join(", ");
    const sql = `UPDATE tareas SET ${setClause} WHERE id = ?`;
    const params = [...Object.values(fieldsToUpdate), id];
    // Flujo: pool.query(sql, params) → result.affectedRows → findById(id)
    return { sql, params, descripcion: "Actualiza campos de una tarea existente" };
  },

  delete: async (id) => {
    const findByIdSql = "SELECT * FROM tareas WHERE id = ?";
    const deleteSql = "DELETE FROM tareas WHERE id = ?";
    // Flujo: 1) findById(id) → si existe, 2) DELETE WHERE id = ? → result.affectedRows > 0
    // IMPORTANTE: Este delete es INDEPENDIENTE de usuarios — solo elimina la tarea,
    // nunca toca la tabla users. El borrado de usuarios se maneja en UserSqlModel.
    return {
      findByIdSql,
      deleteSql,
      params: [id],
      descripcion: "Elimina una tarea por ID (independiente de usuarios)",
    };
  },
};

export default TareasDeleteModel;
