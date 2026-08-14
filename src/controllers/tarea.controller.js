import { TareaModel } from "../models/tarea.model.js";

const getAllTareas = async (req, res) => {
  try {
    const { idUsuario } = req.query;

    if (idUsuario) {
      const tareas = await TareaModel.findByUserId(Number(idUsuario));
      return res.status(200).json(tareas);
    }

    const tareas = await TareaModel.findAll();
    res.status(200).json(tareas);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las tareas",
      data: [],
      errors: [],
    });
  }
};

const getTareaById = async (req, res) => {
  try {
    const { id } = req.params;
    const tarea = await TareaModel.findById(Number(id));

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

const createTarea = async (req, res) => {
  try {
    const { idUsuario, nombreUsuario, descripcion, estado, createdAt } = req.body;

    if (!idUsuario || !descripcion) {
      return res.status(400).json({
        success: false,
        message: "idUsuario y descripcion son obligatorios",
        data: [],
        errors: [],
      });
    }

    const newTarea = await TareaModel.create({
      idUsuario,
      nombreUsuario,
      descripcion,
      estado: estado || "Pendiente",
      createdAt: createdAt || new Date().toISOString(),
    });

    res.status(201).json(newTarea);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear la tarea",
      data: [],
      errors: [],
    });
  }
};

const updateTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTarea = await TareaModel.update(Number(id), req.body);

    if (!updatedTarea) {
      return res.status(404).json({
        success: false,
        message: `Tarea con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }

    res.status(200).json(updatedTarea);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar la tarea",
      data: [],
      errors: [],
    });
  }
};

const deleteTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = await TareaModel.delete(Number(id));

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
