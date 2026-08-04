// ============================================================
// src/app.js (Configuración de la aplicación Express = "El Motor")
// Este archivo prepara el servidor: instala middlewares y
// registra las rutas (endpoints) de la API. No se "enciende" aquí;
// solo se configura y se exporta para que server.js lo arranque.
// ============================================================

import express from "express";
import cors from "cors";

// Importamos todas las rutas (cada una es un Router de Express).
import usuarioRouter from "./routes/usuario.routes.js";
import userRouter from "./routes/user.routes.js";
import proyectoRouter from "./routes/proyecto.routes.js";
import tareaRouter from "./routes/tarea.routes.js";
import categoriaRouter from "./routes/categoria.routes.js";
import notaRouter from "./routes/nota.routes.js";

// "app" es nuestra aplicación Express (el servidor configurado).
const app = express();

// --- Middleware CORS ---
// Permite que el frontend (vite, otro origen) haga peticiones al backend.
// Sin esto, el navegador bloquea los POST/PUT/DELETE (el síntoma que tenías).
app.use(cors({ origin: true }));

// --- Middlewares globales ---
// express.json(): permite leer cuerpos de peticiones en JSON (POST/PATCH).
// express.urlencoded(): permite leer datos de formularios simples.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Ruta de prueba / respaldo: /api ---
// Devuelve un JSON estándar (formato usado en todo el proyecto).
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Saludo de la API",
    data: [],
    errors: [],
  });
});

// --- Registro de las rutas de cada entidad ---
// app.use(elPrefijo, elRouter) monta el router bajo ese prefijo.
// Ej: todo lo que empiece con /tareas irá a tareaRouter.
app.use("/usuarios", usuarioRouter);
app.use("/users", userRouter);
app.use("/proyectos", proyectoRouter);
app.use("/tareas", tareaRouter);
app.use("/categorias", categoriaRouter);
app.use("/notas", notaRouter);

// --- Middleware 404 (se ejecuta cuando ninguna ruta de API coincidió) ---
// Responde en formato JSON estándar para mantener consistencia.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
    data: [],
    errors: [],
  });
});

// Exportamos la app para que server.js la encienda.
export default app;