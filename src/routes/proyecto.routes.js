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
