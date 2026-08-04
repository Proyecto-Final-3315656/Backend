// ============================================================
// src/controllers/user.controller.js (Capa de Controlador)
// Versión de ejemplo sobre la entidad usuario (tabla "users").
// Reúne los endpoints /users que pedía el rubro: listar (GET /users),
// buscar por id (GET /users/:id) y crear (POST /users).
// Usa UsuarioModel (tabla usuarios). NOTA: "name" vs "nombre".
// ============================================================
import { UsuarioModel } from "../models/usuario.model.js";

// --- CONTROLADOR: listar todos los usuarios ---
// GET /users -> responde { success, data:[...] } reutilizando UsuarioModel.findAll.
const getAllUsers = async (req, res) => {
  try {
    const usuarios = await UsuarioModel.findAll(); // pide todos al modelo
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

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;                       // id dinámico de la URL
    const usuario = await UsuarioModel.findById(Number(id)); // busca en BD

    if (!usuario) {                              // si no existe
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${id} no encontrado`,
        data: [],
        errors: [],
      });
    }

    // Variante "example": reemplaza "nombre" por "name" en la respuesta.
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

// --- CONTROLADOR: crear un usuario (vía /users) ---
// POST /users -> envía { nombre, email, telefono } (nombre es obligatorio).
const createUser = async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body; // datos del cuerpo
    // Validación: nombre y email obligatorios (coherente con /usuarios).
    if (!nombre || !email) {
      return res.status(400).json({
        success: false,
        message: "nombre y email son obligatorios",
        data: [],
        errors: [],
      });
    }
    // Pide al modelo que inserta y devuelve el registro creado.
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

export { getAllUsers, getUserById, createUser };
