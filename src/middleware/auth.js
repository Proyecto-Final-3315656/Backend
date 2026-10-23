import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function authenticate(req, res, next) {
  const authorization = req.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Autenticación requerida", data: null, errors: [] });
  }

  try {
    req.user = jwt.verify(authorization.slice(7), config.jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Sesión inválida o vencida", data: null, errors: [] });
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ success: false, message: "No tiene permisos para esta acción", data: null, errors: [] });
    }
    return next();
  };
}
