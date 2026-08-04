// ============================================================
// src/controllers/tarea.controller.js (Capa de Controlador = "El Cerebro")
// Maneja las peticiones del cliente para la entidad Tareas:
// valida los datos, llama al Modelo y responde en JSON. Nota:
// a diferencia de otros CRUD, aquí el estado puede actualizarse
// de forma parcial y el listado puede filtrarse por ?idUsuario.
// ============================================================
import { TareaModel } from "../models/tarea.model.js";

const getAllTareas = async (req, res) => {
  try {
    const { idUsuario } = req.query;

    // Si viene ?idUsuario=N filtramos por usuario; si no, listamos todas.
    if (idUsuario) {
      const tareas = await TareaModel.findByUsuario(Number(idUsuario));
      return res.json(tareas);
    }

    const tareas = await TareaModel.findAll();
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener tareas", errors: [error.message] });
  }
};

// --- CONTROLADOR: buscar una tarea por su id ---
// GET /tareas/:id
const getTareaById = async (req, res) => {
  try {
    const { id } = req.params;                       // id dinámico de la URL
    const tarea = await TareaModel.findById(Number(id)); // busca en BD

    if (!tarea) {                                  // si no existe
      return res.status(404).json({ success: false, message: `Tarea con ID ${id} no encontrada` });
    }

    res.json(tarea);                              // 200 OK con la fila
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al buscar tarea", errors: [error.message] });
  }
};

// --- CONTROLADOR: crear una nueva tarea ---
// POST /tareas (los datos llegan en req.body)
const createTarea = async (req, res) => {
  try {
    const { titulo, descripcion, estado, id_proyecto, idUsuario, nombreUsuario } = req.body;

    // Validación: al menos título o descripción.
    if (!titulo && !descripcion) {
      return res.status(400).json({ success: false, message: "titulo o descripcion es obligatorio" });
    }

    // Pide al modelo que inserta; si falta título se usa la descripción y viceversa.
    const nueva = await TareaModel.create({
      titulo: titulo || descripcion,
      descripcion: descripcion || titulo,
      estado: estado || "Pendiente",      // estado por defecto
      id_proyecto: id_proyecto || null,
      idUsuario: idUsuario || null,
      nombreUsuario: nombreUsuario || null,
    });

    res.status(201).json(nueva);          // 201 = recurso creado
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al crear tarea", errors: [error.message] });
  }
};

// --- CONTROLADOR: actualizar una tarea (parcial) ---
// PATCH /tareas/:id — recibe solo los campos a cambiar (estado | descripcion | ...).
// El modelo aplica whitelist; si no existe devuelve null -> 404.
const updateTarea = async (req, res) => {
  try {
    const { id } = req.params;                         // id de la URL
    const actualizada = await TareaModel.update(Number(id), req.body);

    if (!actualizada) {                          // si el UPDATE no tocó filas
      return res.status(404).json({ success: false, message: `Tarea con ID ${id} no encontrada` });
    }

    res.json(actualizada);                       // 200 OK con la tarea editada
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al actualizar tarea", errors: [error.message] });
  }
};

// --- CONTROLADOR: eliminar una tarea ---
// DELETE /tareas/:id
const deleteTarea = async (req, res) => {
  try {
    const { id } = req.params;                          // id de la URL
    const eliminada = await TareaModel.delete(Number(id)); // borra en BD

    if (!eliminada) {                              // si no existía / falló el borrado
      return res.status(404).json({ success: false, message: `Tarea con ID ${id} no encontrada` });
    }

    res.json({ success: true });                   // 200 OK (cuerpo de confirmación)
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al eliminar tarea", errors: [error.message] });
  }
};

export { getAllTareas, getTareaById, createTarea, updateTarea, deleteTarea };
