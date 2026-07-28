import tareasData from "../data/tareas.data.js";

export const TareaModel = {
  findAll: () => {
    return tareasData;
  },

  findById: (id) => {
    return tareasData.find((t) => t.id === id);
  },

  findByUserId: (userId) => {
    return tareasData.filter((t) => t.idUsuario === userId);
  },

  create: (newTarea) => {
    const maxId = tareasData.reduce((max, t) => Math.max(max, t.id), 0);
    const id = maxId + 1;
    const tareaWithId = { id, ...newTarea };
    tareasData.push(tareaWithId);
    return tareaWithId;
  },

  update: (id, updatedFields) => {
    const index = tareasData.findIndex((t) => t.id === id);
    if (index === -1) return null;

    tareasData[index] = { ...tareasData[index], ...updatedFields };
    return tareasData[index];
  },

  delete: (id) => {
    const index = tareasData.findIndex((t) => t.id === id);
    if (index === -1) return false;
    tareasData.splice(index, 1);
    return true;
  },
};
