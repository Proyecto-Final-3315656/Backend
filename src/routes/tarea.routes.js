// ============================================================
// src/routes/tarea.routes.js (Capa de Rutas = "La Recepción")
// Define los ENDPOINTS de la entidad Tareas y enlaza cada uno
// con su controlador.
// GET/POST en "/" y GET/PATCH/DELETE en "/:id".
// ============================================================
import { Router } from "express";
import {
  getAllTareas,
  getTareaById,
  createTarea,
  updateTarea,
  deleteTarea,
} from "../controllers/tarea.controller.js";

const tareaRouter = Router();

tareaRouter.get("/", getAllTareas);
tareaRouter.get("/:id", getTareaById);
tareaRouter.post("/", createTarea);
tareaRouter.patch("/:id", updateTarea);
tareaRouter.delete("/:id", deleteTarea);

export default tareaRouter;
