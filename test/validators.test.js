import test from "node:test";
import assert from "node:assert/strict";
import { parse, parseId, taskCreateSchema, taskUpdateSchema } from "../src/validators.js";

test("acepta una tarea válida", () => {
  assert.deepEqual(parse(taskCreateSchema, { descripcion: "Revisar documentación" }), {
    descripcion: "Revisar documentación",
    estado: "Pendiente",
  });
});

test("rechaza identificadores y estados inválidos", () => {
  assert.throws(() => parseId("0"));
  assert.throws(() => parse(taskUpdateSchema, { estado: "Archivada" }));
});
