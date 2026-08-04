import { ProyectoModel } from "../models/proyecto.model.js";

const getAllProyectos = async (req, res) => {
  try {
    const proyectos = await ProyectoModel.findAll();
    res.status(200).json({
      success: true,
      message: "Proyectos obtenidos correctamente",
      data: proyectos,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los proyectos",
      data: [],
      errors: [error.message],
    });
  }
};

const getProyectoById = async (req, res) => {
  try {
    const { id } = req.params;
    const proyecto = await ProyectoModel.findById(Number(id));

    if (!proyecto) {
      return res.status(404).json({
        success: false,
        message: `Proyecto con ID ${id} no encontrado`,
        data: [],
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Proyecto encontrado",
      data: proyecto,
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

const createProyecto = async (req, res) => {
  try {
    const { nombre, descripcion, id_usuario } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: "nombre es obligatorio",
        data: [],
        errors: [],
      });
    }

    const nuevo = await ProyectoModel.create({ nombre, descripcion, id_usuario });
    res.status(201).json({
      success: true,
      message: "Proyecto creado correctamente",
      data: nuevo,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear el proyecto",
      data: [],
      errors: [error.message],
    });
  }
};

const updateProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, id_usuario } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: "nombre es obligatorio",
        data: [],
        errors: [],
      });
    }

    const actualizado = await ProyectoModel.update(Number(id), { nombre, descripcion, id_usuario });

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        message: `Proyecto con ID ${id} no encontrado`,
        data: [],
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Proyecto actualizado correctamente",
      data: actualizado,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar el proyecto",
      data: [],
      errors: [error.message],
    });
  }
};

const deleteProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await ProyectoModel.delete(Number(id));

    if (!eliminado) {
      return res.status(404).json({
        success: false,
        message: `No se pudo eliminar: Proyecto con ID ${id} no encontrado`,
        data: [],
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Proyecto eliminado correctamente",
      data: [],
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar el proyecto",
      data: [],
      errors: [error.message],
    });
  }
};

export { getAllProyectos, getProyectoById, createProyecto, updateProyecto, deleteProyecto };
