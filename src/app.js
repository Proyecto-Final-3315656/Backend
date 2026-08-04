import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import usuarioRouter from "./routes/usuario.routes.js";
import userRouter from "./routes/user.routes.js";
import proyectoRouter from "./routes/proyecto.routes.js";
import tareaRouter from "./routes/tarea.routes.js";
import categoriaRouter from "./routes/categoria.routes.js";
import notaRouter from "./routes/nota.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.resolve(__dirname, "../../Modularizacion2-/Modulos");
app.use(express.static(frontendPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Saludo de la API",
    data: [],
    errors: [],
  });
});

app.use("/usuarios", usuarioRouter);
app.use("/users", userRouter);
app.use("/proyectos", proyectoRouter);
app.use("/tareas", tareaRouter);
app.use("/categorias", categoriaRouter);
app.use("/notas", notaRouter);

app.use((req, res) => {
  const rutasApi = ["/api", "/usuarios", "/users", "/proyectos", "/tareas", "/categorias", "/notas"];
  const esRutaApi = rutasApi.some((r) => req.path.startsWith(r));

  if (!esRutaApi) {
    res.sendFile(path.join(frontendPath, "index.html"));
  } else {
    res.status(404).json({
      success: false,
      message: "Ruta no encontrada",
      data: [],
      errors: [],
    });
  }
});

export default app;
