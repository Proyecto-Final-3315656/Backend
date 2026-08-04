// ============================================================
// src/routes/nota.routes.js (Capa de Rutas)
// Endpoints de la entidad Notas montados en "/notas".
// CRUD completo: listar, buscar por id, crear, actualizar, eliminar.
// ============================================================
import { Router } from "express";
import {
  getAllNotas,
  getNotaById,
  createNota,
  updateNota,
  deleteNota,
} from "../controllers/nota.controller.js";

const notaRouter = Router();

notaRouter.get("/", getAllNotas);
notaRouter.get("/:id", getNotaById);
notaRouter.post("/", createNota);
notaRouter.patch("/:id", updateNota);
notaRouter.delete("/:id", deleteNota);

export default notaRouter;
