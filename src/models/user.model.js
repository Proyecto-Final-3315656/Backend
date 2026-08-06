import usersData from "../data/users.data.js";
import tareasData from "../data/tareas.data.js";

export const UserModel = {
  findAll: () => {
    return usersData;
  },

  findById: (id) => {
    return usersData.find((u) => u.id === id);
  },

  getById: (id) => {
    return UserModel.findById(id);
  },

  create: (newUser) => {
    const { nombre, email, telefono } = newUser;
    const maxId = usersData.reduce((max, u) => Math.max(max, u.id), 0);
    const id = maxId + 1;
    const userWithId = { id, nombre, email, telefono };
    usersData.push(userWithId);
    return userWithId;
  },

  delete: (id) => {
    const userIndex = usersData.findIndex((u) => u.id === id);
    if (userIndex === -1) return false;

    const tareasUsuario = tareasData.filter((t) => t.idUsuario === id);
    if (tareasUsuario.length > 0) {
      return { deleted: false, message: "El usuario tiene tareas vinculadas" };
    }

    usersData.splice(userIndex, 1);
    return { deleted: true, message: "Usuario eliminado" };
  },
};
