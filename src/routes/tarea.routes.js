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
