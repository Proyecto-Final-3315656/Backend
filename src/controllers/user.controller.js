import { UserModel } from "../models/user.model.js";

const getUsuarios = (req, res) => {
  try {
    const usuarios = UserModel.findAll();
    return res.status(200).json({
      success: true,
      message: "Usuarios obtenidos correctamente",
      data: usuarios,
      errors: [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener la lista de usuarios",
      data: [],
      errors: [],
    });
  }
};

const getUsuarioById = (req, res) => {
  try {
    const { id } = req.params;
    const usuario = UserModel.findById(Number(id));

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${id} no encontrado`,
        data: [],
        errors: ["No existe"],
      });
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al procesar la búsqueda",
      data: [],
      errors: [],
    });
  }
};

const createUsuario = (req, res) => {
  const { nombre, email, telefono } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({
      success: false,
      message: "nombre y email son obligatorios",
      data: [],
      errors: [],
    });
  }

  const newUser = UserModel.create({ nombre, email, telefono: telefono || "" });
  res.status(201).json(newUser);
};

const deleteUsuario = (req, res) => {
  try {
    const { id } = req.params;

    const tareasUsuario = UserModel.delete(Number(id));

    if (typeof tareasUsuario === "object" && !tareasUsuario.deleted) {
      return res.status(409).json({
        success: false,
        message: "No se puede eliminar el usuario porque tiene tareas vinculadas",
        data: [],
        errors: [],
      });
    }

    if (typeof tareasUsuario === "boolean" && !tareasUsuario) {
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${id} no encontrado`,
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
      message: "Error al intentar eliminar el usuario",
      data: [],
      errors: [],
    });
  }
};

export { getUsuarios, getUsuarioById, createUsuario, deleteUsuario };
