import { UserModel } from "../models/user.model.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();
    res.status(200).json({
      success: true,
      message: "Usuarios obtenidos correctamente",
      data: users,
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al procesar la búsqueda de usuarios",
      data: [],
      errors: [],
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);

    if (!Number.isInteger(numericId)) {
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${id} no encontrado`,
        data: [],
        errors: ["No existe"],
      });
    }

    const user = await UserModel.findById(numericId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${id} no encontrado`,
        data: [],
        errors: ["No existe"],
      });
    }

    res.status(200).json({
      success: true,
      message: "Usuario encontrado",
      data: [user],
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

const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "name y email son obligatorios",
        data: [],
        errors: [],
      });
    }

    const user = await UserModel.create({ name, email });
    res.status(201).json({
      success: true,
      message: "Usuario creado correctamente",
      data: [user],
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear el usuario",
      data: [],
      errors: [],
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);

    if (!Number.isInteger(numericId)) {
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${id} no encontrado`,
        data: [],
        errors: [],
      });
    }

    const updatedUser = await UserModel.update(numericId, req.body);

    if (!updatedUser) {
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
      data: [updatedUser],
      errors: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar el usuario",
      data: [],
      errors: [],
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);

    if (!Number.isInteger(numericId)) {
      return res.status(404).json({
        success: false,
        message: `No se pudo eliminar: Usuario con ID ${id} no encontrado`,
        data: [],
        errors: [],
      });
    }

    const isDeleted = await UserModel.delete(numericId);

    if (!isDeleted) {
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
      message: "Error al intentar eliminar el usuario",
      data: [],
      errors: [],
    });
  }
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
