import "./src/loadEnv.js";
import app from "./src/app.js";
import { testConnection } from "./src/db/connection.js";

const PORT = process.env.PORT || 3000;

// Comprueba la conexión a MySQL al arrancar y muestra un mensaje claro.
testConnection();

app.listen(PORT, () => {
  console.log(`Servidor encendido en el puerto ${PORT}`);
});
