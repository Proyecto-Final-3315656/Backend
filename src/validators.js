import { z } from "zod";

const id = z.coerce.number().int().positive();
const nombre = z.string().trim().min(3).max(100);
const email = z.string().trim().email().max(150).transform((value) => value.toLowerCase());
const telefono = z.string().trim().max(50).optional().default("");
const descripcion = z.string().trim().min(3).max(1000);
const estado = z.enum(["Pendiente", "En Proceso", "Completada"]);

export const userCreateSchema = z.object({ nombre, email, telefono, rol: z.enum(["admin", "usuario"]).optional().default("usuario") });
export const userUpdateSchema = z.object({ nombre: nombre.optional(), email: email.optional(), telefono: telefono.optional(), rol: z.enum(["admin", "usuario"]).optional() }).refine((value) => Object.keys(value).length > 0, "Debe enviar al menos un campo");
export const loginSchema = z.object({ email, password: z.string().min(8).max(128) });
export const taskCreateSchema = z.object({ descripcion, estado: estado.optional().default("Pendiente") });
export const taskUpdateSchema = z.object({ descripcion: descripcion.optional(), estado: estado.optional() }).refine((value) => Object.keys(value).length > 0, "Debe enviar descripción o estado");

export function parse(schema, value) {
  const result = schema.safeParse(value);
  if (!result.success) {
    const error = new Error("Datos inválidos");
    error.status = 422;
    error.details = result.error.issues.map((issue) => issue.path.join(".") || issue.message);
    throw error;
  }
  return result.data;
}

export function parseId(value) {
  return parse(id, value);
}
