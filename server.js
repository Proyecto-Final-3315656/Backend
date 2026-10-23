import "./src/loadEnv.js";
import app from "./src/app.js";
import { testConnection } from "./src/db/connection.js";
import { config, validateEnvironment } from "./src/config.js";

async function startServer() {
  validateEnvironment();
  // No aceptar peticiones si MySQL no esta disponible.
  await testConnection();

  app.listen(config.port, () => {
    console.log(`Servidor encendido en el puerto ${config.port}`);
  });
}

startServer();
