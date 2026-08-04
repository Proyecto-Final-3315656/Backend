import { Router } from "express";
import {
  getAllCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../controllers/categoria.controller.js";

const categoriaRouter = Router();

categoriaRouter.get("/", getAllCategorias);
categoriaRouter.get("/:id", getCategoriaById);
categoriaRouter.post("/", createCategoria);
categoriaRouter.patch("/:id", updateCategoria);
categoriaRouter.delete("/:id", deleteCategoria);

export default categoriaRouter;
