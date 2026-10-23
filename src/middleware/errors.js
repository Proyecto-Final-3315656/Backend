export function notFound(req, res) {
  res.status(404).json({ success: false, message: "Ruta no encontrada", data: null, errors: [] });
}

export function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  console.error("[API]", error.message);

  if (error.status === 422) {
    return res.status(422).json({ success: false, message: "Datos inválidos", data: null, errors: error.details || [] });
  }

  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ success: false, message: "El correo ya está registrado", data: null, errors: ["email"] });
  }

  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(422).json({ success: false, message: "El usuario indicado no existe", data: null, errors: ["idUsuario"] });
  }

  return res.status(500).json({ success: false, message: "Ocurrió un error interno", data: null, errors: [] });
}
