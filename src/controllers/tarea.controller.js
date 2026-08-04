import { TareaModel } from "../models/tarea.model.js";

const getAllTareas = async (req, res) => {
  try {
    const { idUsuario } = req.query;

    if (idUsuario) {
      const tareas = await TareaModel.findByUsuario(Number(idUsuario));
      return res.json(tareas);
    }

    const tareas = await TareaModel.findAll();
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener tareas", errors: [error.message] });
  }
};

const getTareaById = async (req, res) => {
  try {
    const { id } = req.params;
    const tarea = await TareaModel.findById(Number(id));

    if (!tarea) {
      return res.status(404).json({ success: false, message: `Tarea con ID ${id} no encontrada` });
    }

    res.json(tarea);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al buscar tarea", errors: [error.message] });
  }
};

const createTarea = async (req, res) => {
  try {
    const { titulo, descripcion, estado, id_proyecto, idUsuario, nombreUsuario } = req.body;

    if (!titulo && !descripcion) {
      return res.status(400).json({ success: false, message: "titulo o descripcion es obligatorio" });
    }

    const nueva = await TareaModel.create({
      titulo: titulo || descripcion,
      descripcion: descripcion || titulo,
      estado: estado || "Pendiente",
      id_proyecto: id_proyecto || null,
      idUsuario: idUsuario || null,
      nombreUsuario: nombreUsuario || null,
    });

    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al crear tarea", errors: [error.message] });
  }
};

const updateTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizada = await TareaModel.update(Number(id), req.body);

    if (!actualizada) {
      return res.status(404).json({ success: false, message: `Tarea con ID ${id} no encontrada` });
    }

    res.json(actualizada);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al actualizar tarea", errors: [error.message] });
  }
};

const deleteTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminada = await TareaModel.delete(Number(id));

    if (!eliminada) {
      return res.status(404).json({ success: false, message: `Tarea con ID ${id} no encontrada` });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al eliminar tarea", errors: [error.message] });
  }
};

export { getAllTareas, getTareaById, createTarea, updateTarea, deleteTarea };
