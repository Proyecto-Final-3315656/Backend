import { UsuarioModel } from "../models/usuario.model.js";

const getUserById = async (req, res) => {
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

    res.json({
      id: usuario.id,
      name: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al buscar el usuario",
      data: [],
      errors: [error.message],
    });
  }
};

export { getUserById };
