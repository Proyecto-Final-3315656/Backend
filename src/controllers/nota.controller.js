import { NotaModel } from "../models/nota.model.js";

const getAllNotas = async (req, res) => {
  try {
    const notas = await NotaModel.findAll();
    res.status(200).json({
      success: true,
      message: "Notas obtenidas correctamente",
      data: notas,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las notas",
      data: [],
      errors: [error.message],
    });
  }
};

const getNotaById = async (req, res) => {
  try {
    const { id } = req.params;
    const nota = await NotaModel.findById(Number(id));

    if (!nota) {
      return res.status(404).json({
        success: false,
        message: `Nota con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Nota encontrada",
      data: nota,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al procesar la busqueda",
      data: [],
      errors: [error.message],
    });
  }
};

const createNota = async (req, res) => {
  try {
    const { contenido, id_tarea, id_usuario } = req.body;

    if (!contenido) {
      return res.status(400).json({
        success: false,
        message: "contenido es obligatorio",
        data: [],
        errors: [],
      });
    }

    const nueva = await NotaModel.create({ contenido, id_tarea, id_usuario });
    res.status(201).json({
      success: true,
      message: "Nota creada correctamente",
      data: nueva,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear la nota",
      data: [],
      errors: [error.message],
    });
  }
};

const updateNota = async (req, res) => {
  try {
    const { id } = req.params;
    const { contenido, id_tarea, id_usuario } = req.body;

    if (!contenido) {
      return res.status(400).json({
        success: false,
        message: "contenido es obligatorio",
        data: [],
        errors: [],
      });
    }

    const actualizada = await NotaModel.update(Number(id), { contenido, id_tarea, id_usuario });

    if (!actualizada) {
      return res.status(404).json({
        success: false,
        message: `Nota con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Nota actualizada correctamente",
      data: actualizada,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar la nota",
      data: [],
      errors: [error.message],
    });
  }
};

const deleteNota = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminada = await NotaModel.delete(Number(id));

    if (!eliminada) {
      return res.status(404).json({
        success: false,
        message: `No se pudo eliminar: Nota con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Nota eliminada correctamente",
      data: [],
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar la nota",
      data: [],
      errors: [error.message],
    });
  }
};

export { getAllNotas, getNotaById, createNota, updateNota, deleteNota };
