// ============================================================
// src/controllers/usuario.controller.js (Capa de Controlador = "El Cerebro")
// Recibe la petición del cliente (req), le pide datos al Modelo,
// y responde con un JSON (res). Aplica las reglas de validación
// y maneja los errores. NO accede directamente a la base de datos.
// ============================================================

// Importamos el Modelo de usuarios (única vía para tocar los datos).
import { UsuarioModel } from "../models/usuario.model.js";
// Importamos el Modelo de tareas: al borrar un usuario borramos (cascada)
// también sus tareas para que no queden huérfanas apuntando a un usuario inexistente.
import { TareaModel } from "../models/tarea.model.js";

// --- CONTROLADOR: listar todos los usuarios ---
// GET /usuarios
const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await UsuarioModel.findAll(); // pide todos al modelo
    res.status(200).json({                         // responde 200 OK (éxito)
      success: true,
      message: "Usuarios obtenidos correctamente",
      data: usuarios,        // los datos van dentro de "data"
      errors: [],
    });
  } catch (error) {
    res.status(500).json({   // 500 = error interno del servidor
      success: false,
      message: "Error al obtener los usuarios",
      data: [],
      errors: [error.message], // detalle del error para depuración
    });
  }
};

// --- CONTROLADOR: buscar un usuario por su id ---
// GET /usuarios/:id
const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;                  // lee el id de la URL
    const usuario = await UsuarioModel.findById(Number(id)); // busca en BD

    if (!usuario) {
      return res.status(404).json({             // 404 = no encontrado
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

// --- CONTROLADOR: crear un nuevo usuario ---
// POST /usuarios (los datos llegan en req.body)
const createUsuario = async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body; // extrae datos del cuerpo

    // Validación: nombre y email son obligatorios.
    if (!nombre || !email) {
      return res.status(400).json({              // 400 = petición inválida
        success: false,
        message: "nombre y email son obligatorios",
        data: [],
        errors: [],
      });
    }

    // Pide al modelo que inserta y devuelve el registro creado.
    const nuevo = await UsuarioModel.create({ nombre, email, telefono });
    res.status(201).json({                       // 201 = recurso creado
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

// --- CONTROLADOR: actualizar un usuario ---
// PATCH /usuarios/:id
const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, telefono } = req.body;

    // Validación igual que al crear.
    if (!nombre || !email) {
      return res.status(400).json({
        success: false,
        message: "nombre y email son obligatorios",
        data: [],
        errors: [],
      });
    }

    const actualizado = await UsuarioModel.update(Number(id), { nombre, email, telefono });

    if (!actualizado) {                          // si el update no tocó filas
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

// --- CONTROLADOR: eliminar un usuario ---
// DELETE /usuarios/:id
const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    // Pide al modelo que borra este usuario.
    const eliminado = await UsuarioModel.delete(Number(id)); // borra en BD

    if (!eliminado) {                              // si no existía / falló
      return res.status(404).json({
        success: false,
        message: `No se pudo eliminar: Usuario con ID ${id} no encontrado`,
        data: [],
        errors: [],
      });
    }

    // Cascada: también borramos las tareas que pertenecían a este usuario
    // para que desaparezcan de la tabla y del Kanban (no quedan huérfanas).
    await TareaModel.deleteByUsuario(Number(id));

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

// Exportamos todos los controladores para que las rutas los usen.
export { getAllUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario };