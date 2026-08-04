// ============================================================
// server.js (Punto de entrada de la aplicación)
// Su misión: "encender" el servidor. Es el archivo que Node ejecuta
// primero (lo indica package.json -> "start": "node server.js").
// Solo importa la app/config y arranca, no contiene lógica de negocio.
// ============================================================

// "app" importa toda la configuración de Express definida en src/app.js
import app from "./src/app.js";

// "verifyConnection" verifica que la base de datos responde (src/config/db.js)
import { verifyConnection } from "./src/config/db.js";

// Puerto: usa la variable de entorno PORT; si no existe, usa 3000.
const PORT = process.env.PORT || 3000;

// Paso 1: comprobar la conexión a la base de datos ANTES de arrancar.
// Si la BD no responde, el servidor no inicia (evita errores a mitad de uso).
const startServer = async () => {
  const dbOk = await verifyConnection();

  // Si la BD falló, mostramos el error y frenamos el proceso (exit 1 = error).
  if (!dbOk) {
    console.error("No se pudo conectar a la base de datos. Verifica la configuracion en .env");
    process.exit(1);
  }

  // Paso 2: poner a escuchar el servidor en el puerto indicado.
  // "localhost" limita el acceso solo a este computador.
  app.listen(PORT, "localhost", () => {
    console.log(`Servidor encendido en http://localhost:${PORT}`);
  });
};

// Ejecutamos la función de arranque definida arriba.
startServer();