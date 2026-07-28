import { TareaModel } from "../models/tarea.model.js";

const getAllTareas = (req, res) => {
  const { idUsuario } = req.query;

  if (idUsuario) {
    const tareas = TareaModel.findByUserId(Number(idUsuario));
    return res.status(200).json(tareas);
  }

  const tareas = TareaModel.findAll();
  res.status(200).json(tareas);
};

const getTareaById = (req, res) => {
  try {
    const { id } = req.params;
    const tarea = TareaModel.findById(Number(id));

    if (!tarea) {
      return res.status(404).json({
        success: false,
        message: `Tarea con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }

    res.status(200).json(tarea);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al procesar la búsqueda",
      data: [],
      errors: [],
    });
  }
};

const createTarea = (req, res) => {
  const { idUsuario, nombreUsuario, descripcion, estado, createdAt } = req.body;

  if (!idUsuario || !descripcion) {
    return res.status(400).json({
      success: false,
      message: "idUsuario y descripcion son obligatorios",
      data: [],
      errors: [],
    });
  }

  const newTarea = TareaModel.create({
    idUsuario,
    nombreUsuario,
    descripcion,
    estado: estado || "Pendiente",
    createdAt: createdAt || new Date().toISOString(),
  });

  res.status(201).json(newTarea);
};

const updateTarea = (req, res) => {
  const { id } = req.params;
  const updatedTarea = TareaModel.update(Number(id), req.body);

  if (!updatedTarea) {
    return res.status(404).json({
      success: false,
      message: `Tarea con ID ${id} no encontrada`,
      data: [],
      errors: [],
    });
  }

  res.status(200).json(updatedTarea);
};

const deleteTarea = (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = TareaModel.delete(Number(id));

    if (!isDeleted) {
      return res.status(404).json({
        success: false,
        message: `No se pudo eliminar: Tarea con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Tarea eliminada correctamente",
      data: [],
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al intentar eliminar la tarea",
      data: [],
      errors: [],
    });
  }
};

export { getAllTareas, getTareaById, createTarea, updateTarea, deleteTarea };
