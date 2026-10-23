import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model.js";
import { parse, parseId, userCreateSchema, userUpdateSchema } from "../validators.js";
import { z } from "zod";

const userCreateWithPasswordSchema = userCreateSchema.extend({ password: z.string().min(12).max(128) });

function send(res, status, message, data) {
  return res.status(status).json({ success: status < 400, message, data, errors: [] });
}

export async function getUsuarios(req, res, next) {
  try {
    return send(res, 200, "Usuarios obtenidos correctamente", await UserModel.findAll());
  } catch (error) {
    return next(error);
  }
}

export async function getUsuarioById(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (req.user.rol !== "admin" && req.user.sub !== id) {
      return send(res, 403, "No tiene permisos para consultar este usuario", null);
    }
    const usuario = await UserModel.findById(id);
    if (!usuario) return send(res, 404, "Usuario no encontrado", null);
    return send(res, 200, "Usuario obtenido correctamente", usuario);
  } catch (error) {
    return next(error);
  }
}

export async function createUsuario(req, res, next) {
  try {
    const { password, ...userData } = req.body;
    const data = parse(userCreateWithPasswordSchema, { ...userData, password });
    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await UserModel.create({ ...data, passwordHash });
    return send(res, 201, "Usuario creado correctamente", user);
  } catch (error) {
    return next(error);
  }
}

export async function updateUsuario(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const data = parse(userUpdateSchema, req.body);
    if (req.user.sub === id && data.rol && data.rol !== req.user.rol) {
      return send(res, 403, "No puede cambiar su propio rol", null);
    }
    const user = await UserModel.update(id, data);
    if (!user) return send(res, 404, "Usuario no encontrado", null);
    return send(res, 200, "Usuario actualizado correctamente", user);
  } catch (error) {
    return next(error);
  }
}

export async function deleteUsuario(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (req.user.sub === id) return send(res, 409, "No puede eliminar su propia cuenta", null);
    const deleted = await UserModel.delete(id);
    if (!deleted) return send(res, 404, "Usuario no encontrado", null);
    return send(res, 200, "Usuario y sus tareas eliminados correctamente", null);
  } catch (error) {
    return next(error);
  }
}
