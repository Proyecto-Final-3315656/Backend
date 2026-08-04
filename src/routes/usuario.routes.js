// ============================================================
// src/routes/usuario.routes.js (Capa de Rutas = "La Recepción")
// Define los ENDPOINTS (URLs) de la entidad Usuarios y decide
// qué controlador atiende cada uno.
//
// MÉTODO    RUTA          CONTROLADOR        ACCIÓN
// GET       /usuarios     getAllUsuarios     listar todos
// GET       /usuarios/:id getUsuarioById     buscar uno por id
// POST      /usuarios     createUsuario      crear
// PATCH     /usuarios/:id updateUsuario      actualizar
// DELETE    /usuarios/:id deleteUsuario      eliminar
// ============================================================
import { Router } from "express";

// Importamos los controladores (lógica que atenderá cada ruta).
import {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../controllers/usuario.controller.js";

// Creamos un Router: pequeño "mapa de rutas" independiente.
const usuarioRouter = Router();

// --- Definición de cada endpoint y su controlador asociado ---
usuarioRouter.get("/", getAllUsuarios);          // listar todos
usuarioRouter.get("/:id", getUsuarioById);       // buscar por id (el :id es dinámico)
usuarioRouter.post("/", createUsuario);          // crear
usuarioRouter.patch("/:id", updateUsuario);      // actualizar parcialmente
usuarioRouter.delete("/:id", deleteUsuario);     // eliminar

// Exportamos el router para montarlo en app.js bajo el prefijo "/usuarios".
export default usuarioRouter;