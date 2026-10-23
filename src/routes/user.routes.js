import { Router } from "express";
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/", getUsuarios);
userRouter.get("/:id", getUsuarioById);
userRouter.post("/", createUsuario);
userRouter.patch("/:id", updateUsuario);
userRouter.delete("/:id", deleteUsuario);

export default userRouter;
