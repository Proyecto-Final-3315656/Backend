import { CategoriaModel } from "../models/categoria.model.js";

const getAllCategorias = async (req, res) => {
  try {
    const categorias = await CategoriaModel.findAll();
    res.status(200).json({
      success: true,
      message: "Categorias obtenidas correctamente",
      data: categorias,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las categorias",
      data: [],
      errors: [error.message],
    });
  }
};

const getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await CategoriaModel.findById(Number(id));

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: `Categoria con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Categoria encontrada",
      data: categoria,
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

const createCategoria = async (req, res) => {
  try {
    const { nombre, color } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: "nombre es obligatorio",
        data: [],
        errors: [],
      });
    }

    const nueva = await CategoriaModel.create({ nombre, color });
    res.status(201).json({
      success: true,
      message: "Categoria creada correctamente",
      data: nueva,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear la categoria",
      data: [],
      errors: [error.message],
    });
  }
};

const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, color } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: "nombre es obligatorio",
        data: [],
        errors: [],
      });
    }

    const actualizada = await CategoriaModel.update(Number(id), { nombre, color });

    if (!actualizada) {
      return res.status(404).json({
        success: false,
        message: `Categoria con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Categoria actualizada correctamente",
      data: actualizada,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar la categoria",
      data: [],
      errors: [error.message],
    });
  }
};

const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminada = await CategoriaModel.delete(Number(id));

    if (!eliminada) {
      return res.status(404).json({
        success: false,
        message: `No se pudo eliminar: Categoria con ID ${id} no encontrada`,
        data: [],
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Categoria eliminada correctamente",
      data: [],
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar la categoria",
      data: [],
      errors: [error.message],
    });
  }
};

export { getAllCategorias, getCategoriaById, createCategoria, updateCategoria, deleteCategoria };
