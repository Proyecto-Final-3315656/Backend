import { TareaModel } from "../models/tarea.model.js";

const getAllTareas = async (req, res) => {
  try {
    const { idUsuario } = req.query;

    if (idUsuario) {
      const tareas = await TareaModel.findByUserId(Number(idUsuario));
      return res.status(200).json({
        success: true,
        message: "Tareas del usuario obtenidas correctamente",
        data: tareas,
        errors: [],
      });
    }

    const tareas = await TareaModel.findAll();
    res.status(200).json({
      success: true,
      message: "Tareas obtenidas correctamente",
      data: tareas,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al procesar la búsqueda de tareas",
      data: [],
      errors: [],
    });
  }
};

const getTareaById = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);

    if (!Number.isInteger(numericId)) {
      return res.status(404).json({
        success: false,
        message: `Tarea con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }

    const tarea = await TareaModel.findById(numericId);

    if (!tarea) {
      return res.status(404).json({
        success: false,
        message: `Tarea con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Tarea encontrada",
      data: [tarea],
      errors: [],
    });
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
    const { idUsuario, nombreUsuario, descripcion, estado } = req.body;

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
      estado,
    });

    res.status(201).json({
      success: true,
      message: "Tarea creada correctamente",
      data: [newTarea],
      errors: [],
    });
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
    const numericId = Number(id);

    if (!Number.isInteger(numericId)) {
      return res.status(404).json({
        success: false,
        message: `Tarea con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }

    const updatedTarea = await TareaModel.update(numericId, req.body);

    if (!updatedTarea) {
      return res.status(404).json({
        success: false,
        message: `Tarea con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Tarea actualizada correctamente",
      data: [updatedTarea],
      errors: [],
    });
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
    const numericId = Number(id);

    if (!Number.isInteger(numericId)) {
      return res.status(404).json({
        success: false,
        message: `No se pudo eliminar: Tarea con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }

    const isDeleted = await TareaModel.delete(numericId);

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
