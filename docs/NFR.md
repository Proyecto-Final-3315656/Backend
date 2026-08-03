# Requisitos No Funcionales - Guía de Cumplimiento

Documento corto que explica cómo se cumplen los **RNF** en el proyecto y cómo se trabaja en equipo con Git.

---

## 1. RNF01 - Arquitectura por capas ✅

El código está separado en capas, cada una con una sola responsabilidad:

| Capa | Carpeta | Responsabilidad |
| :--- | :--- | :--- |
| **Rutas** | `src/routes/` | Recibe la URL y delega en el controlador. NO contiene lógica. |
| **Controladores** | `src/controllers/` | Procesa la petición, valida entrada, responde HTTP con formato estándar. |
| **Modelos** | `src/models/` | Única capa que accede a los datos (buscar, crear, actualizar, borrar). |
| **Base de datos** | `src/database/` | Pool de conexiones a MySQL (`db.js`), credenciales vía variables de entorno. |
| **Datos / Seed** | `src/data/` y `src/seed/` | Datos iniciales y script que los inserta en MySQL. |

Archivos existentes: `user.*` y `tarea.*` en cada capa.

## 2. RNF02 - Separación de responsabilidades ✅

Flujo de una petición (ej. `GET /tareas/1`):

```
Cliente → Routes → Controller → Model → Base de datos (MySQL)
   ↑         |         |          |
   └─────────┴─────────┴──────────┘
        Respuesta JSON estandarizada
```

- **Routes** solo enrutan: `tarea.routes.js:12` → `router.get("/:id", getTareaById)`.
- **Controller** orquesta: valida `req`, llama al modelo y construye la respuesta.
- **Model** es el único que toca los datos: `TareaModel.findById(id)` ejecuta el SQL sobre el pool.

No hay `import` de modelos dentro de las rutas ni lógica de negocio en ellas.

## 3. RNF03 - Control de versiones con Git ✅

Cada integrante debe:

1. Hacer un **fork** del repositorio principal en GitHub.
2. Clonar su fork y crear una rama por requisito:
   ```bash
   git clone <url-del-fork>
   git checkout -b feature/<mi-nombre>
   ```
3. Confirmar cambios con **commits claros**:
   ```bash
   git add .
   git commit -m "feat: crear CRUD de tareas"
   ```
4. Buenas prácticas ya aplicadas en el proyecto: `.gitignore` excluye `node_modules`, `.env` y logs. El archivo `.env.example` documenta las variables que cada quien debe copiar a `.env`.

## 4. RNF04 - Integración mediante Pull Request ✅

Al terminar la funcionalidad:

1. Subir la rama al fork: `git push -u origin feature/<mi-nombre>`.
2. Crear el **Pull Request** en GitHub desde el fork hacia el repositorio principal.
3. El PR debe incluir:
   - Descripción del requisito implementado.
   - Explicación de los cambios realizados (archivos tocados y por qué).
   - Evidencia de pruebas: capturas de Postman o salida de `curl`.
4. Esperar revisión y aprobación antes de hacer `merge`.

## 5. RNF05 - Funcionamiento correcto del sistema ✅

Formato de respuesta estándar en TODAS las rutas:

```json
{ "success": true, "message": "Mensaje descriptivo", "data": [...], "errors": [] }
```

### Persistencia en MySQL

- La base de datos `tareas_adso` se crea con `database.sql` (tablas `users` y `tareas`).
- La conexión usa el usuario `app_user` definido en `.env` (ver `.env.example`).
- **CRUD completo** en ambas entidades: `users` y `tareas`.

### Endpoints disponibles

| Método | Ruta | Acción |
| :--- | :--- | :--- |
| GET | `/api` | Saludo de la API |
| GET | `/users` | Listar usuarios |
| GET | `/users/:id` | Buscar usuario por ID |
| POST | `/users` | Crear usuario |
| PATCH | `/users/:id` | Actualizar usuario |
| DELETE | `/users/:id` | Eliminar usuario |
| GET | `/tareas` | Listar tareas (usa `?idUsuario=` para filtrar) |
| GET | `/tareas/:id` | Buscar tarea por ID |
| POST | `/tareas` | Crear tarea |
| PATCH | `/tareas/:id` | Actualizar tarea |
| DELETE | `/tareas/:id` | Eliminar tarea |

### Cómo verificar (pruebas de funcionamiento)

```bash
npm install
npm run seed    # carga los datos iniciales en MySQL
npm run dev     # arranca el servidor en el puerto 3000
```

```bash
# Respuestas correctas (200/201)
curl http://localhost:3000/users
curl http://localhost:3000/tareas
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d "{\"name\":\"Juan\",\"email\":\"juan@mail.com\"}"
curl -X POST http://localhost:3000/tareas -H "Content-Type: application/json" -d "{\"idUsuario\":2,\"descripcion\":\"Nueva tarea\"}"

# Errores controlados (404/400)
curl http://localhost:3000/users/999
curl http://localhost:3000/tareas/abc
```

**Resultado de las pruebas ejecutadas en este proyecto:** todos los endpoints responden con el formato estándar y códigos HTTP correctos (`200`, `201`, `400`, `404`). Además se comprobó que los datos **persisten tras reiniciar el servidor** (se leen desde MySQL).
