import { UserModel } from "../models/user.model.js";

const getUserById = (req, res) => {
  try {
    const { id } = req.params;
    const user = UserModel.findById(Number(id));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${id} no encontrado`,
        data: [],
        errors: ["No existe"],
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al procesar la búsqueda",
      data: [],
      errors: [],
    });
  }
};

export { getUserById };
