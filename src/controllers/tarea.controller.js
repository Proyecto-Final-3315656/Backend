import { TareaModel } from "../models/tarea.model.js";
import { parse, parseId, taskCreateSchema, taskUpdateSchema } from "../validators.js";

function send(res, status, message, data) {
  return res.status(status).json({ success: status < 400, message, data, errors: [] });
}

async function canAccessTask(taskId, user) {
  return user.rol === "admin" || TareaModel.belongsToUser(taskId, user.sub);
}

export async function getAllTareas(req, res, next) {
  try {
    const requestedUserId = req.query.idUsuario ? parseId(req.query.idUsuario) : null;
    const userId = req.user.rol === "admin" ? requestedUserId : req.user.sub;
    const tareas = userId ? await TareaModel.findByUserId(userId) : await TareaModel.findAll();
    return send(res, 200, "Tareas obtenidas correctamente", tareas);
  } catch (error) {
    return next(error);
  }
}

export async function getTareaById(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!(await canAccessTask(id, req.user))) return send(res, 403, "No tiene permisos para consultar esta tarea", null);
    const tarea = await TareaModel.findById(id);
    if (!tarea) return send(res, 404, "Tarea no encontrada", null);
    return send(res, 200, "Tarea obtenida correctamente", tarea);
  } catch (error) {
    return next(error);
  }
}

export async function createTarea(req, res, next) {
  try {
    const data = parse(taskCreateSchema, req.body);
    const idUsuario = req.user.rol === "admin" && req.body.idUsuario ? parseId(req.body.idUsuario) : req.user.sub;
    const tarea = await TareaModel.create({ ...data, idUsuario, createdAt: new Date().toISOString() });
    return send(res, 201, "Tarea creada correctamente", tarea);
  } catch (error) {
    return next(error);
  }
}

export async function updateTarea(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!(await canAccessTask(id, req.user))) return send(res, 403, "No tiene permisos para actualizar esta tarea", null);
    const tarea = await TareaModel.update(id, parse(taskUpdateSchema, req.body));
    if (!tarea) return send(res, 404, "Tarea no encontrada", null);
    return send(res, 200, "Tarea actualizada correctamente", tarea);
  } catch (error) {
    return next(error);
  }
}

export async function deleteTarea(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!(await canAccessTask(id, req.user))) return send(res, 403, "No tiene permisos para eliminar esta tarea", null);
    if (!(await TareaModel.delete(id))) return send(res, 404, "Tarea no encontrada", null);
    return send(res, 200, "Tarea eliminada correctamente", null);
  } catch (error) {
    return next(error);
  }
}
