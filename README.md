# API Task Manager ADSO — Backend

API REST en **Node.js + Express 5** con arquitectura en capas y persistencia en **MySQL**.  
CORS está habilitado (`app.use(cors({ origin: true })`) para consumirse desde el frontend Vite.

## Arranque

```bash
cd "D:/ADSO/3315656/Deivy/Backend"
npm run dev        # nodemon -> http://localhost:3000
# (producción) npm start
```

## `.env` (configuración DB)

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=deivy
DB_PASSWORD=12345
DB_NAME=tareas_adso
DB_CHARSET=utf8
```

`src/config/db.js` crea la pool y la DB automáticamente si no existe.

## Arquitectura en capas (`src/`)

```
src/
├── app.js          # Express: middlewares (express.json), CORS, rutas
├── config/db.js    # Pool MySQL2 + creación automática de DB
├── controllers/    # "El cerebro": valida, llama al Modelo, responde JSON
├── models/         # "El especialista": solo ejecuta SQL (pool.query)
├── routes/         # "La recepción": enlaza URLs <-> controllers
└── data/           # seeds/ mocks estáticos (users.data.js, tareas.data.js)
server.js           # Punto de arranque: importa app y levanta el listener
```

## Endpoints

| Método | Ruta              | Controller         | Descripción |
|--------|-------------------|--------------------|-------------|
| GET    | `/tareas`         | `getAllTareas`     | Lista todas (filtra con `?idUsuario=N`) |
| GET    | `/tareas/:id`     | `getTareaById`     | Tarea por id |
| POST   | `/tareas`         | `createTarea`      | Crear (`titulo` o `descripcion` obligatorio) |
| PATCH  | `/tareas/:id`     | `updateTarea`      | `{estado}` / `{descripcion}` parcial (whitelist de campos) |
| DELETE | `/tareas/:id`     | `deleteTarea`      | Devuelve 404 si no existe |
| GET    | `/usuarios`       | `getAllUsuarios`   | Lista usuarios |
| GET    | `/users/:id`      | `getUserById`      | Alias `/api/users/:id` |
| POST   | `/usuarios`       | `createUsuario`    | Crear usuario |
| GET    | `/proyectos`      | proyecto.controller| Listado de proyectos |

## Modelo de Tarea

```
tareas.id, idUsuario, nombreUsuario, titulo, descripcion, estado, id_proyecto
estado ∈ {Pendiente, En Proceso, Completada}
```

`models/tarea.model.js` expone `findAll / findById / findByUsuario / findByProyecto / create / update / delete`.  
El `update` recorre una whitelist y hace `UPDATE ... SET col=? WHERE id=?` solo con los campos enviados.

## Estado en el Kanban

El estado de una tarea puede cambiarse de tres formas — las tres quedan reflejadas en el tablero:
1. **Tabla → button estado** (`tasksToTable.handlerCambiarEstado` PATCH + refresca Kanban).
2. **Drag & drop** del Kanban (`adminView` `drop` → `updateTaskStatus` + `renderKanban`).
3. **Modal de edición** de la tabla (PATCH descripción + refresca Kanban).

## Notas para la demo

- El backend debe estar arriba antes que el frontend (el Vite lo consume en caliente).
- Los datos quedan limpios: 15 usuarios, 5 tareas (idUsuario=1, "Ana Torres").
- Si el puerto 3000 está ocupado: `Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess`.
