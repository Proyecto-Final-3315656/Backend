import { UsuarioModel } from "../models/usuario.model.js";

const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await UsuarioModel.findAll();
    res.status(200).json({
      success: true,
      message: "Usuarios obtenidos correctamente",
      data: usuarios,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los usuarios",
      data: [],
      errors: [error.message],
    });
  }
};

const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await UsuarioModel.findById(Number(id));

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${id} no encontrado`,
        data: [],
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Usuario encontrado",
      data: usuario,
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

const createUsuario = async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({
        success: false,
        message: "nombre y email son obligatorios",
        data: [],
        errors: [],
      });
    }

    const nuevo = await UsuarioModel.create({ nombre, email, telefono });
    res.status(201).json({
      success: true,
      message: "Usuario creado correctamente",
      data: nuevo,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear el usuario",
      data: [],
      errors: [error.message],
    });
  }
};

const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, telefono } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({
        success: false,
        message: "nombre y email son obligatorios",
        data: [],
        errors: [],
      });
    }

    const actualizado = await UsuarioModel.update(Number(id), { nombre, email, telefono });

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${id} no encontrado`,
        data: [],
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Usuario actualizado correctamente",
      data: actualizado,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar el usuario",
      data: [],
      errors: [error.message],
    });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await UsuarioModel.delete(Number(id));

    if (!eliminado) {
      return res.status(404).json({
        success: false,
        message: `No se pudo eliminar: Usuario con ID ${id} no encontrado`,
        data: [],
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Usuario eliminado correctamente",
      data: [],
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar el usuario",
      data: [],
      errors: [error.message],
    });
  }
};

export { getAllUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario };
