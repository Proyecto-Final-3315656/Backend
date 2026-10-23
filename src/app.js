import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import userRouter from "./routes/user.routes.js";
import tareaRouter from "./routes/tarea.routes.js";
import authRouter from "./routes/auth.routes.js";
import { authenticate, authorize } from "./middleware/auth.js";
import { errorHandler, notFound } from "./middleware/errors.js";
import { config } from "./config.js";

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
    path.resolve(__dirname, "../../../fronted/Frontend-/Modulos/dist"),
  ];
  return candidatos.find((c) => fs.existsSync(c)) || candidatos[0];
}

const frontendPath = resolverFrontendPath();
console.log(`[APP] Sirviendo frontend desde: ${frontendPath}`);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: config.corsOrigins, methods: ["GET", "POST", "PATCH", "DELETE"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200, standardHeaders: "draft-8", legacyHeaders: false }));
app.use(express.static(frontendPath));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API disponible",
    data: { status: "ok" },
    errors: [],
  });
});

app.use("/api/auth", authRouter);
app.use("/api/usuarios", authenticate, authorize("admin"), userRouter);
app.use("/api/tareas", authenticate, tareaRouter);

app.use((req, res) => {
  if (!req.path.startsWith("/api")) {
    const indexFile = path.join(frontendPath, "index.html");
    if (fs.existsSync(indexFile)) {
      res.sendFile(indexFile);
    } else {
      res.status(503).send(
        "Frontend no compilado. Ejecuta 'npm run build' en la carpeta Modulos/ del frontend."
      );
    }
  } else return notFound(req, res);
});

app.use(errorHandler);

export default app;
