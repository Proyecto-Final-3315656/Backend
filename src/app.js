import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import userRouter from "./routes/user.routes.js";
import tareaRouter from "./routes/tarea.routes.js";

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

app.use("/usuarios", userRouter);
app.use("/tareas", tareaRouter);

app.use((req, res) => {
  if (!req.path.startsWith("/api") && !req.path.startsWith("/usuarios") && !req.path.startsWith("/tareas")) {
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