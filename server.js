import "./src/loadEnv.js";
import app from "./src/app.js";
import { testConnection } from "./src/db/connection.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  // No aceptar peticiones si MySQL no esta disponible.
  await testConnection();

  app.listen(PORT, () => {
    console.log(`Servidor encendido en el puerto ${PORT}`);
  });
}

startServer();
