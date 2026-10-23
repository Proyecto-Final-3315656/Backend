const required = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME", "JWT_SECRET"];

export function validateEnvironment() {
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno requeridas: ${missing.join(", ")}`);
  }

  if (process.env.DB_USER.toLowerCase() === "root") {
    throw new Error("DB_USER no puede ser root.");
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET debe tener al menos 32 caracteres.");
  }
}

export const config = {
  port: Number(process.env.PORT || 3000),
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  jwtSecret: process.env.JWT_SECRET,
  corsOrigins: (process.env.CORS_ORIGIN || "http://localhost:5173").split(",").map((origin) => origin.trim()),
};
