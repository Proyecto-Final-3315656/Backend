// ============================================================
// src/routes/user.routes.js (Capa de Rutas)
// Endpoints sobre la entidad usuario en "/users":
// GET /users      -> listar todos
// GET /users/:id  -> buscar uno por id (restructura nombre -> name)
// POST /users     -> crear
// (Montado en app.js bajo el prefijo "/users".)
// ============================================================
import { Router } from "express";
import { getAllUsers, getUserById, createUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);          // listar todos
userRouter.get("/:id", getUserById);       // buscar por id
userRouter.post("/", createUser);          // crear

export default userRouter;
