import { UserModel } from "../models/user.model.js";

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await UserModel.findAll();
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

const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await UserModel.findById(Number(id));

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

    const newUser = await UserModel.create({ nombre, email, telefono: telefono || "" });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear el usuario",
      data: [],
      errors: [],
    });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // Borrado INDEPENDIENTE: el modelo solo elimina el usuario. Si tiene
    // tareas vinculadas devuelve { deleted: false } -> 409 (Conflict).
    // Las tareas se eliminan por separado (DELETE /tareas/:id).
    const tareasUsuario = await UserModel.delete(Number(id));

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
