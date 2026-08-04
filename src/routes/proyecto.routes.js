// ============================================================
// src/routes/proyecto.routes.js (Capa de Rutas)
// Endpoints de la entidad Proyectos montados en "/proyectos".
// CRUD completo: listar, buscar por id, crear, actualizar, eliminar.
// ============================================================
import { Router } from "express";
import {
  getAllProyectos,
  getProyectoById,
  createProyecto,
  updateProyecto,
  deleteProyecto,
} from "../controllers/proyecto.controller.js";

const proyectoRouter = Router();

proyectoRouter.get("/", getAllProyectos);
proyectoRouter.get("/:id", getProyectoById);
proyectoRouter.post("/", createProyecto);
proyectoRouter.patch("/:id", updateProyecto);
proyectoRouter.delete("/:id", deleteProyecto);

export default proyectoRouter;
