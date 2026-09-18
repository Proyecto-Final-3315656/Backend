# Eliminacion de tareas y usuarios

Este documento explica, para la exposicion, como funciona el boton de eliminar desde la pantalla hasta MySQL. Describe el codigo que participa realmente en la aplicacion.

## Idea principal para explicar

La aplicacion tiene dos tipos de eliminacion:

| Accion visible | Que elimina | Desde donde se activa |
| --- | --- | --- |
| `Eliminar` | Solo la tarea de la fila | Columna **Acciones** de la tabla de tareas |
| `🗑` o `🗑 Usuario` | El usuario y todas sus tareas | Fila de una tarea perteneciente a ese usuario |

Antes de eliminar, la aplicacion muestra un modal de confirmacion. Ningun borrado se realiza si se pulsa **Cancelar**, la `X`, fuera del modal o la tecla `Escape`.

> Importante: MySQL tiene la regla `ON DELETE RESTRICT`. Por eso no se puede borrar un usuario mientras tenga tareas. El frontend primero elimina las tareas de ese usuario, una por una, y despues elimina el usuario.

## Guion corto para la exposicion

1. "Cada fila de la tabla se construye dinamicamente con los datos de una tarea."
2. "En esa fila hay un boton para eliminar solo la tarea y dos accesos equivalentes para eliminar al usuario con sus tareas."
3. "Al hacer clic no se borra de inmediato: se abre un modal de confirmacion."
4. "Cuando se confirma, el frontend usa `fetch` con el metodo HTTP `DELETE`."
5. "Express recibe la ruta, el controlador coordina la operacion y el modelo ejecuta SQL parametrizado en MySQL."
6. "Para un usuario, se eliminan primero sus tareas porque la llave foranea impide borrarlo si todavia tiene tareas asociadas."
7. "Al terminar, la interfaz se actualiza y muestra una notificacion de exito o de error."

## Mapa de archivos

### Frontend: `C:\fronted\Frontend-\Modulos`

| Archivo | Responsabilidad en la eliminacion |
| --- | --- |
| `index.html:95-113` | Declara la tabla de tareas y el `tbody` con id `messagesContainer`. |
| `src/ui/toInsertIntoTable.js:12-37` | Crea el HTML de cada fila y de los botones. |
| `src/ui/tasksToTable.js:17-174` | Asigna los clics, abre el modal y coordina las eliminaciones. |
| `src/ui/modal.js:112-146` | Construye el modal de confirmacion y sus botones. |
| `src/services/taskService.js:18-24, 62-68` | Solicita tareas de un usuario y elimina tareas por HTTP. |
| `src/services/userService.js:45-50` | Elimina el usuario por HTTP. |
| `src/api/config.js:1` | Define `API_URL` como ruta relativa vacia. |
| `vite.config.js:6-9` | En desarrollo reenvia `/usuarios` y `/tareas` al backend en puerto 3000. |
| `src/ui/showEmptyTask.js:10-25` | Actualiza el contador y el mensaje de tabla vacia. |
| `src/ui/usuariosView.js:21-46` | Vuelve a cargar la lista de usuarios despues de borrar uno. |
| `style.css:160-213` | Da estilo visual a los botones destructivos. |

### Backend: `C:\backend\Backend`

| Archivo | Responsabilidad en la eliminacion |
| --- | --- |
| `src/app.js:42-43` | Monta las rutas `/usuarios` y `/tareas`. |
| `src/routes/tarea.routes.js:16` | Registra `DELETE /tareas/:id`. |
| `src/routes/user.routes.js:14` | Registra `DELETE /usuarios/:id`. |
| `src/controllers/tarea.controller.js:106-134` | Responde la eliminacion de una tarea. |
| `src/controllers/user.controller.js:72-113` | Responde la eliminacion de un usuario. |
| `src/models/tarea.model.js:69-72` | Ejecuta el SQL que borra una tarea. |
| `src/models/user.model.js:31-48` | Comprueba tareas vinculadas y borra el usuario si corresponde. |
| `database.sql:18-27` | Declara la llave foranea que protege la relacion usuario-tarea. |

## Lo que se ve en el aplicativo

Los botones se generan por cada tarea en `src/ui/toInsertIntoTable.js`.

```js
// Linea 16: crea una fila HTML <tr> en memoria.
const fila = document.createElement('tr');

// Linea 17: guarda el id de la tarea como atributo data-id de la fila.
fila.dataset.id = idTarea;

// Lineas 18-35: define las cinco celdas de la fila.
fila.innerHTML = `
  <td>
    ${idUsuario}
    <!-- Linea 22: icono junto al ID; elimina usuario y sus tareas. -->
    <button class="btn-borrar-usuario-fila" data-id-usuario="${idUsuario}">🗑</button>
  </td>
  <td>${nombre}</td>
  <td class="descripcion-celda">${descripcion}</td>
  <td><span class="estado-tag">${estado}</span></td>
  <td>
    <button class="btn-estado">...</button>
    <button class="btn-editar">Editar</button>
    <!-- Linea 32: borra solamente esta tarea. -->
    <button class="btn-eliminar">Eliminar</button>
    <!-- Linea 33: misma operacion que el icono de la linea 22. -->
    <button class="btn-borrar-usuario">🗑 Usuario</button>
  </td>
`;
```

### Explicacion de cada boton

| Boton | Clase CSS | Funcion asignada | Resultado |
| --- | --- | --- | --- |
| `Eliminar` | `.btn-eliminar` | `handlerEliminar(tarea.id, fila)` | Borra solo la tarea identificada por `tarea.id`. |
| `🗑` junto al ID | `.btn-borrar-usuario-fila` | `handlerEliminarUsuario(tarea.idUsuario, tarea.nombreUsuario)` | Borra tareas del usuario y, al final, el usuario. |
| `🗑 Usuario` | `.btn-borrar-usuario` | `handlerEliminarUsuario(tarea.idUsuario, tarea.nombreUsuario)` | Hace exactamente lo mismo que el icono compacto. |

El boton `Eliminar` tiene un degradado rojo en `style.css:194`. El boton `🗑 Usuario` tiene un rojo mas intenso en `style.css:195-204`, para indicar que la accion afecta mas registros. El icono compacto recibe sus estilos directamente en el atributo `style` de `toInsertIntoTable.js:22`.

> La pestaña **Usuarios registrados** no contiene boton para eliminar. `src/ui/usuariosView.js:29-42` solo dibuja ID, nombre, email y telefono. Por tanto, un usuario se elimina buscando alguna de sus tareas en la tabla principal. Un usuario sin tareas no tiene un boton de eliminacion visible.

## Paso comun: asignacion de clics

Archivo: `src/ui/tasksToTable.js:17-36`.

```js
// 17: recibe una tarea obtenida de la API para dibujarla.
export function agregarFilaTabla(tarea) {
    // 18: quita el mensaje "No hay tareas" si se va a insertar la primera fila.
    if (localState.total === 0 && tablaTareas) tablaTareas.innerHTML = '';

    // 20: crea el elemento <tr> y todos sus botones.
    const fila = buildRowHtml(tarea.id, tarea.nombreUsuario, tarea.idUsuario, tarea.descripcion, tarea.estado);

    // 22-23: conectan los otros botones de estado y edicion.
    fila.querySelector('.btn-estado').onclick = () => handlerCambiarEstado(tarea.id, tarea.estado, fila);
    fila.querySelector('.btn-editar').onclick = () => handlerEditar(tarea.id, fila);

    // 24: al pulsar Eliminar, envia el ID de tarea y la fila a borrar visualmente.
    fila.querySelector('.btn-eliminar').onclick = () => handlerEliminar(tarea.id, fila);

    // 26: busca el icono de usuario dentro de la fila.
    const btnUsuario = fila.querySelector('.btn-borrar-usuario-fila');
    // 27: evita error si el boton no existe.
    if (btnUsuario) {
        // 28: el icono recibe el ID y el nombre del usuario de la tarea.
        btnUsuario.onclick = () => handlerEliminarUsuario(tarea.idUsuario, tarea.nombreUsuario);
    }

    // 31: el boton "🗑 Usuario" usa el mismo handler y los mismos datos.
    fila.querySelector('.btn-borrar-usuario').onclick = () => handlerEliminarUsuario(tarea.idUsuario, tarea.nombreUsuario);

    // 33: agrega la fila terminada al cuerpo de la tabla.
    tablaTareas.appendChild(fila);
    // 34-35: incrementa y muestra el contador visible.
    localState.total++;
    actualizarContadorInterfaz(localState.total);
}
```

# Eliminar una tarea

## Flujo completo

```text
Boton "Eliminar"
  -> handlerEliminar(id, filaHTML)
  -> modal "Eliminar tarea"
  -> usuario pulsa "Si, eliminar"
  -> DELETE /tareas/:id
  -> ruta Express
  -> controlador deleteTarea
  -> modelo TareaModel.delete
  -> DELETE FROM tareas WHERE id = ?
  -> MySQL confirma el borrado
  -> se elimina la fila, se actualiza el contador y se muestra notificacion
```

## 1. Confirmacion y actualizacion visual

Archivo: `src/ui/tasksToTable.js:96-120`.

```js
// 96: recibe el ID de la tarea y el nodo <tr> de esa tarea.
async function handlerEliminar(id, filaHTML) {
    // 98: abre un modal reutilizable; no borra todavia.
    abrirModalConfirmar(
        // 99: titulo mostrado en el modal.
        'Eliminar tarea',
        // 100: advertencia para el usuario.
        '¿Está seguro de que desea eliminar esta tarea? Esta acción no se puede deshacer.',
        // 101: activa icono y boton de peligro.
        'danger',
        // 102: esta funcion solo se ejecuta al confirmar.
        async () => {
            try {
                // 104: llama al servicio que envia DELETE /tareas/:id.
                await taskService.deleteTask(id);
                // 105: quita del DOM la fila que ya fue eliminada en MySQL.
                filaHTML.remove();
                // 106: informa que la operacion fue exitosa.
                lanzarNotificacion("¡Tarea eliminada de la base de datos!", "green", "#e8f8f5");
                // 107: disminuye el total mostrado.
                localState.total--;
                // 108: actualiza contador y, si queda en cero, mensaje vacio.
                actualizarContadorInterfaz(localState.total);

                // 111: solo recarga el Kanban si esa pestana esta visible.
                if (document.getElementById('seccion-administrador')?.classList.contains('activo')) {
                    // 112-113: importa y dibuja de nuevo el Kanban con datos de la API.
                    const adminMod = await import('../ui/adminView');
                    adminMod.renderKanban();
                }
            } catch {
                // 116: si la peticion falla, conserva la fila y avisa el error.
                lanzarNotificacion("Error de red al intentar eliminar la tarea.", "red", "#fdedec");
            }
        }
    );
}
```

El contador se actualiza mediante `src/ui/showEmptyTask.js:10-25`:

```js
// 10: recibe el nuevo total de filas.
export function actualizarContadorInterfaz(totalTareas) {
    // 12-14: escribe, por ejemplo, "3 tareas registradas".
    if (contadorTexto) {
        contadorTexto.innerText = `${totalTareas} tareas registradas`;
    }
    // 17: cuando el total es cero, reemplaza la tabla por un mensaje vacio.
    if (totalTareas === 0 && tablaTareas) {
        tablaTareas.innerHTML = `<tr id="emptyState"><td colspan="5">No hay tareas registradas en el sistema.</td></tr>`;
    }
}
```

## 2. Servicio HTTP de tareas

Archivo: `src/services/taskService.js:62-68`.

```js
// 64: declara la operacion reutilizable de borrado.
async deleteTask(id) {
    // 65: hace una peticion HTTP DELETE a la tarea indicada.
    const res = await fetch(`${API_URL}/tareas/${id}`, { method: 'DELETE' });
    // 66: si el backend responde 404 o 500, detiene el flujo y entra al catch.
    if (!res.ok) throw new Error();
    // 67: informa al handler que la respuesta fue correcta.
    return true;
}
```

`API_URL` vale `''` en `src/api/config.js:1`; por eso la URL final es `/tareas/ID`. En desarrollo, `vite.config.js:6-9` reenvia esa peticion a `http://localhost:3000/tareas/ID`.

## 3. Ruta, controlador y SQL

La aplicacion monta `app.use('/tareas', tareaRouter)` en `Backend/src/app.js:43`. Dentro de `src/routes/tarea.routes.js` ocurre esto:

```js
// 1: importa Router de Express.
import { Router } from "express";
// 2-8: importa funciones controladoras, incluida deleteTarea.
import { getAllTareas, getTareaById, createTarea, updateTarea, deleteTarea } from "../controllers/tarea.controller.js";
// 10: crea el router especifico de tareas.
const tareaRouter = Router();
// 16: asocia DELETE /tareas/:id con deleteTarea.
tareaRouter.delete("/:id", deleteTarea);
// 18: exporta el router para que app.js lo monte.
export default tareaRouter;
```

Archivo: `src/controllers/tarea.controller.js:106-134`.

```js
// 106: controlador ejecutado por la ruta DELETE /tareas/:id.
const deleteTarea = async (req, res) => {
    try {
        // 108: toma el parametro :id de la URL.
        const { id } = req.params;
        // 109: lo convierte a numero y delega el SQL al modelo.
        const isDeleted = await TareaModel.delete(Number(id));

        // 111-118: si no hubo fila afectada, responde 404.
        if (!isDeleted) {
            return res.status(404).json({
                success: false,
                message: `No se pudo eliminar: Tarea con ID ${id} no encontrada`,
                data: [],
                errors: [],
            });
        }

        // 120-125: si MySQL borro una fila, responde 200.
        res.status(200).json({
            success: true,
            message: "Tarea eliminada correctamente",
            data: [],
            errors: [],
        });
    } catch (error) {
        // 126-133: cualquier error inesperado responde 500.
        res.status(500).json({
            success: false,
            message: "Error al intentar eliminar la tarea",
            data: [],
            errors: [],
        });
    }
};
```

Archivo: `src/models/tarea.model.js:69-72`.

```js
// 69: metodo del modelo para eliminar una tarea.
delete: async (id) => {
    // 70: ? es un parametro SQL; evita concatenar directamente el ID en la consulta.
    const [result] = await pool.query("DELETE FROM tareas WHERE id = ?", [id]);
    // 71: devuelve true si MySQL elimino una fila; false si no encontro el ID.
    return result.affectedRows > 0;
},
```

## Respuestas de la API al borrar tarea

| Situacion | HTTP | Respuesta principal |
| --- | --- | --- |
| Tarea eliminada | `200` | `success: true`, `Tarea eliminada correctamente` |
| ID inexistente | `404` | `success: false`, `Tarea con ID ... no encontrada` |
| Error de servidor o BD | `500` | `success: false`, `Error al intentar eliminar la tarea` |

# Eliminar un usuario y sus tareas

## Flujo completo

```text
Boton "🗑" o "🗑 Usuario"
  -> handlerEliminarUsuario(idUsuario, nombreUsuario)
  -> modal "Eliminar usuario"
  -> GET /tareas?idUsuario=:idUsuario
  -> por cada tarea: DELETE /tareas/:idTarea
  -> DELETE /usuarios/:idUsuario
  -> recarga tabla de tareas, lista de usuarios y Kanban si esta abierto
```

## 1. Confirmacion, borrado secuencial y refresco

Archivo: `src/ui/tasksToTable.js:122-159`.

```js
// 122-124: documenta el orden obligatorio: tareas primero, usuario despues.
// El backend no aplica cascada automatica.
async function handlerEliminarUsuario(idUsuario, nombreUsuario) {
    // 127: abre el mismo modal de confirmacion.
    abrirModalConfirmar(
        // 128: titulo para el usuario.
        'Eliminar usuario',
        // 129: explica que se eliminan todas sus tareas y despues el usuario.
        `¿Eliminar a "${nombreUsuario}" y TODAS sus tareas? Se borrarán una por una y luego el usuario. Esta acción no se puede deshacer.`,
        // 130: estilo de peligro.
        'danger',
        // 131: callback que solo inicia despues de confirmar.
        async () => {
            try {
                // 134: busca en la API todas las tareas del usuario.
                const tareas = await taskService.getTasksByUserId(idUsuario);
                // 135: recorre cada tarea encontrada.
                for (const tarea of tareas) {
                    // 136: espera el DELETE de una tarea antes de continuar con la siguiente.
                    await taskService.deleteTask(tarea.id);
                }

                // 140: al no quedar tareas, solicita borrar el usuario.
                await userService.deleteUser(idUsuario);
                // 141: muestra la notificacion de exito.
                lanzarNotificacion(`Usuario "${nombreUsuario}" y sus tareas eliminados.`, "green", "#e8f8f5");

                // 144: vuelve a consultar y dibujar la tabla de tareas.
                await refrescarTablaTareas();
                // 147: vuelve a consultar y dibujar la lista de usuarios.
                renderUsuarios();

                // 150-153: actualiza Kanban solo si su pestana esta activa.
                if (document.getElementById('seccion-administrador')?.classList.contains('activo')) {
                    const adminMod = await import('../ui/adminView');
                    adminMod.renderKanban();
                }
            } catch {
                // 155: avisa si fallo obtener, borrar una tarea o borrar el usuario.
                lanzarNotificacion("Error al eliminar el usuario o alguna de sus tareas.", "red", "#fdedec");
            }
        }
    );
}
```

La recarga de tareas usada al final esta en `src/ui/tasksToTable.js:161-170`:

```js
// 162: funcion auxiliar para sincronizar la tabla con MySQL.
async function refrescarTablaTareas() {
    try {
        // 164: consulta las tareas que permanecen en la base de datos.
        const tareas = await taskService.getTasks();
        // 165: vacia filas y reinicia el contador local.
        limpiarTabla();
        // 166: crea de nuevo una fila y botones por cada tarea restante.
        tareas.forEach(t => agregarFilaTabla(t));
    } catch {
        // 168: comunica un problema al volver a cargar la interfaz.
        lanzarNotificacion("No se pudieron recargar las tareas.", "red", "#fdedec");
    }
}
```

## 2. Servicios HTTP usados para el usuario

Archivo: `src/services/taskService.js:18-24`.

```js
// 20: consulta las tareas pertenecientes a un usuario.
async getTasksByUserId(idUsuario) {
    // 21: forma GET /tareas?idUsuario=ID y convierte el ID a numero.
    const res = await fetch(`${API_URL}/tareas?idUsuario=${Number(idUsuario)}`);
    // 22: si falla la respuesta, permite que el handler muestre el error.
    if (!res.ok) throw new Error();
    // 23: entrega el arreglo de tareas al for...of.
    return await res.json();
}
```

Archivo: `src/services/userService.js:45-50`.

```js
// 45: define el servicio para borrar un usuario por ID.
async deleteUser(id) {
    // 46-48: envia DELETE /usuarios/ID sin cuerpo porque el ID va en la URL.
    const res = await fetch(`${API_URL}/usuarios/${Number(id)}`, {
        method: 'DELETE',
    });
    // 49: convierte respuestas 404, 409 o 500 en un error para el handler.
    if (!res.ok) throw new Error("ErrorServidor");
    // 50: devuelve el JSON de exito del backend.
    return await res.json();
}
```

## 3. Ruta, controlador y modelo de usuario

`Backend/src/app.js:42` monta el router con `app.use('/usuarios', userRouter)`.

Archivo: `src/routes/user.routes.js`.

```js
// 1: obtiene Router de Express.
import { Router } from "express";
// 2-7: importa los controladores, incluido deleteUsuario.
import { getUsuarios, getUsuarioById, createUsuario, deleteUsuario } from "../controllers/user.controller.js";
// 9: crea el router de usuarios.
const userRouter = Router();
// 14: conecta DELETE /usuarios/:id con el controlador deleteUsuario.
userRouter.delete("/:id", deleteUsuario);
// 16: permite que app.js use este router.
export default userRouter;
```

Archivo: `src/controllers/user.controller.js:72-113`.

```js
// 72: controlador de DELETE /usuarios/:id.
const deleteUsuario = async (req, res) => {
    try {
        // 74: obtiene el ID enviado en la URL.
        const { id } = req.params;
        // 79: pide al modelo comprobar y borrar el usuario.
        const tareasUsuario = await UserModel.delete(Number(id));

        // 81-88: si tiene tareas, responde conflicto 409 y no borra el usuario.
        if (typeof tareasUsuario === "object" && !tareasUsuario.deleted) {
            return res.status(409).json({
                success: false,
                message: "No se puede eliminar el usuario porque tiene tareas vinculadas",
                data: [],
                errors: [],
            });
        }

        // 90-97: si no existe, responde 404.
        if (typeof tareasUsuario === "boolean" && !tareasUsuario) {
            return res.status(404).json({
                success: false,
                message: `Usuario con ID ${id} no encontrado`,
                data: [],
                errors: [],
            });
        }

        // 99-104: si fue borrado, responde 200.
        res.status(200).json({
            success: true,
            message: "Usuario eliminado correctamente",
            data: [],
            errors: [],
        });
    } catch (error) {
        // 105-112: error no previsto al consultar o borrar MySQL.
        res.status(500).json({
            success: false,
            message: "Error al intentar eliminar el usuario",
            data: [],
            errors: [],
        });
    }
};
```

Archivo: `src/models/user.model.js:31-48`.

```js
// 31: metodo del modelo que concentra las operaciones de base de datos.
delete: async (id) => {
    // 32: busca primero el usuario para distinguir un ID inexistente.
    const user = await UserModel.findById(id);
    // 33: false se convertira en respuesta HTTP 404 en el controlador.
    if (!user) return false;

    // 38-41: cuenta tareas vinculadas sin borrar aun.
    const [tareas] = await pool.query(
        "SELECT COUNT(*) AS total FROM tareas WHERE idUsuario = ?",
        [id]
    );
    // 42-44: si existe alguna tarea, devuelve objeto para generar HTTP 409.
    if (tareas[0].total > 0) {
        return { deleted: false, message: "El usuario tiene tareas vinculadas" };
    }

    // 46: sin tareas asociadas, ejecuta el DELETE parametrizado del usuario.
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
    // 47: devuelve exito al controlador.
    return { deleted: true, message: "Usuario eliminado" };
},
```

## 4. Regla de integridad en MySQL

Archivo: `Backend/database.sql:18-27`.

```sql
-- 18: crea la tabla que almacena tareas.
CREATE TABLE IF NOT EXISTS tareas (
    -- 20: toda tarea debe tener el ID de un usuario.
    idUsuario INT NOT NULL,
    -- 26: conecta tareas.idUsuario con users.id.
    CONSTRAINT fk_tarea_usuario FOREIGN KEY (idUsuario)
    -- RESTRICT bloquea borrar el usuario si hay tareas asociadas.
    REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);
```

`ON DELETE RESTRICT` es la proteccion final de la base de datos. Aunque el frontend intentara borrar un usuario antes de sus tareas, MySQL rechazaria esa operacion. `ON UPDATE CASCADE` significa que, si cambiara un ID de usuario, MySQL actualizaría los IDs relacionados; no interviene en el borrado.

## Respuestas de la API al borrar usuario

| Situacion | HTTP | Significado |
| --- | --- | --- |
| Usuario eliminado sin tareas | `200` | El usuario fue borrado correctamente. |
| Usuario inexistente | `404` | No existe un usuario con ese ID. |
| Usuario con tareas | `409 Conflict` | Primero deben borrarse sus tareas. |
| Error de servidor o BD | `500` | Fallo inesperado durante la operacion. |

# Modal de confirmacion

Archivo: `src/ui/modal.js:112-146`.

```js
// 115: recibe titulo, mensaje, tipo y la accion que se ejecutara al confirmar.
export function abrirModalConfirmar(titulo, mensaje, tipo = 'info', onConfirmar) {
    // 116: crea el overlay si todavia no existe.
    if (!overlay) crearEstructura();

    // 118-121: obtiene referencias a las zonas del modal.
    const tituloEl = overlay.querySelector('.modal-titulo');
    const icono = overlay.querySelector('.modal-icon');
    const body = overlay.querySelector('.modal-body');
    const botones = overlay.querySelector('.modal-botones');

    // 123: escribe el titulo recibido desde el handler.
    tituloEl.textContent = titulo;
    // 124: muestra advertencia para acciones de tipo danger.
    icono.textContent = tipo === 'danger' ? '⚠️' : 'ℹ️';
    // 125: muestra el texto explicativo.
    body.innerHTML = `<p class="modal-mensaje">${mensaje}</p>`;
    // 126: limpia botones de una apertura anterior.
    botones.innerHTML = '';

    // 128-131: crea el boton principal rojo "Si, eliminar".
    const btnSi = document.createElement('button');
    btnSi.type = 'button';
    btnSi.textContent = tipo === 'danger' ? 'Sí, eliminar' : 'Confirmar';
    btnSi.className = tipo === 'danger' ? 'btn-modal-primary danger' : 'btn-modal-primary';
    // 132-135: cierra el modal y ejecuta el callback de eliminacion.
    btnSi.onclick = () => {
        cerrarModal();
        onConfirmar();
    };
    botones.appendChild(btnSi);

    // 138-143: crea Cancelar, que solamente cierra el modal.
    const btnNo = document.createElement('button');
    btnNo.type = 'button';
    btnNo.textContent = 'Cancelar';
    btnNo.className = 'btn-modal-secondary';
    btnNo.onclick = cerrarModal;
    botones.appendChild(btnNo);

    // 145: muestra el modal con su animacion CSS.
    overlay.classList.add('modal-activo');
}
```

Tambien se puede cerrar sin borrar haciendo clic fuera de la caja (`modal.js:31-34`), pulsando `Escape` (`modal.js:37-40`) o usando el boton `X` (`modal.js:43`).

# Observaciones importantes para responder preguntas

1. **No hay borrado automatico en cascada.** La frase de comentario en `src/services/userService.js:42-44` que dice que el backend borra tareas en cascada no coincide con el codigo activo. El comportamiento real esta en `tasksToTable.js:134-140`: frontend borra tareas y luego usuario.
2. **Puede haber borrado parcial.** Si falla una de varias peticiones `DELETE /tareas/:id`, las tareas anteriores ya se eliminaron y el usuario no se borra. No existe una transaccion que revierta los cambios.
3. **Los filtros y exportacion pueden quedar desactualizados.** `src/index.js` conserva `todasLasTareas` para filtrar y exportar, pero los handlers de eliminacion no actualizan ese arreglo. La tabla se ve actualizada, aunque el estado usado por filtros puede conservar datos antiguos hasta una carga nueva.
4. **Los dos botones de usuario son redundantes intencionalmente.** El icono compacto facilita borrar desde la columna ID y `🗑 Usuario` hace la accion mas visible en Acciones; ambos llaman la misma funcion.
5. **El archivo `src/models/tareasdelete.model.js` no participa.** Contiene SQL explicativo, pero no esta importado ni ejecutado. El modelo real es `src/models/tarea.model.js`.
6. **La eliminacion es permanente.** No hay papelera, estado de archivado ni forma de recuperar los registros despues de confirmar.

## Preguntas frecuentes

### Por que se confirma antes de borrar?

Porque la accion es permanente. El modal evita que un clic accidental ejecute inmediatamente un `DELETE` en MySQL.

### Por que primero se eliminan las tareas?

Porque una tarea depende de un usuario mediante una llave foranea. `ON DELETE RESTRICT` protege la integridad de la base de datos e impide dejar tareas sin usuario.

### Que pasa si se intenta eliminar un usuario directamente desde Postman?

Si ese usuario tiene tareas, el backend responde `409 Conflict` con el mensaje "No se puede eliminar el usuario porque tiene tareas vinculadas". Primero deben borrarse las tareas.

### Que pasa si el usuario pulsa Cancelar?

Solo se cierra el modal. No se llama al servicio, no se envía una peticion HTTP y no cambia MySQL.

### Como se sabe que el borrado fue exitoso?

El backend devuelve HTTP `200`. El frontend entonces actualiza la interfaz y muestra una notificacion verde.
