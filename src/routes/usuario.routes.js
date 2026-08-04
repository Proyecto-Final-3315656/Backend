import { Router } from "express";
import {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../controllers/usuario.controller.js";

const usuarioRouter = Router();

usuarioRouter.get("/", getAllUsuarios);
usuarioRouter.get("/:id", getUsuarioById);
usuarioRouter.post("/", createUsuario);
usuarioRouter.patch("/:id", updateUsuario);
usuarioRouter.delete("/:id", deleteUsuario);

export default usuarioRouter;
