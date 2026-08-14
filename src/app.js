import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import userRouter from "./routes/user.routes.js";
import tareaRouter from "./routes/tarea.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resuelve la ruta de la build del frontend (vite build) de forma robusta:
// 1. Variable FRONTEND_PATH (.env)
// 2. ../frontend/dist  (si el frontend vive junto al backend)
// 3. ../../Modularizacion2-/Modulos/dist (estructura original del equipo)
function resolverFrontendPath() {
  if (process.env.FRONTEND_PATH) return path.resolve(process.env.FRONTEND_PATH);
  const candidatos = [
    path.resolve(__dirname, "../../frontend/dist"),
    path.resolve(__dirname, "../../Modularizacion2-/Modulos/dist"),
  ];
  return candidatos.find((c) => fs.existsSync(c)) || candidatos[0];
}

const frontendPath = resolverFrontendPath();
console.log(`[APP] Sirviendo frontend desde: ${frontendPath}`);
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
    const indexFile = path.join(frontendPath, "index.html");
    if (fs.existsSync(indexFile)) {
      res.sendFile(indexFile);
    } else {
      res.status(503).send(
        "Frontend no compilado. Ejecuta 'npm run build' en la carpeta Modulos/ del frontend."
      );
    }
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