import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { UserModel } from "../models/user.model.js";
import { loginSchema, parse } from "../validators.js";

function publicUser(user) {
  return { id: user.id, nombre: user.nombre, email: user.email, telefono: user.telefono, rol: user.rol };
}

export async function login(req, res, next) {
  try {
    const { email, password } = parse(loginSchema, req.body);
    const user = await UserModel.findByEmailWithPassword(email);
    if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ success: false, message: "Correo o contraseña inválidos", data: null, errors: [] });
    }

    const token = jwt.sign({ sub: user.id, rol: user.rol, nombre: user.nombre }, config.jwtSecret, { expiresIn: "8h" });
    return res.json({ success: true, message: "Sesión iniciada", data: { token, user: publicUser(user) }, errors: [] });
  } catch (error) {
    return next(error);
  }
}

export async function me(req, res, next) {
  try {
    const user = await UserModel.findById(req.user.sub);
    if (!user) return res.status(401).json({ success: false, message: "La cuenta ya no existe", data: null, errors: [] });
    return res.json({ success: true, message: "Sesión válida", data: publicUser(user), errors: [] });
  } catch (error) {
    return next(error);
  }
}
