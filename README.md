# API de Usuarios y Tareas - Arquitectura en Capas (Node.js + MySQL)

Backend de aprendizaje en **Node.js** con **ES Modules**, organizado en **arquitectura por capas** (rutas → controladores → modelos) y con **persistencia real en MySQL**.

---

## 1. Instalación y configuración

```bash
# 1. Instalar dependencias
npm install

# 2. Crear la base de datos y las tablas
#    Ejecuta database.sql en MySQL (Workbench o terminal)

# 3. Configurar credenciales
cp .env.example .env   # (Windows: copia manual) y ajusta si cambiaste contraseñas

# 4. Cargar los datos iniciales en MySQL
npm run seed

# 5. Arrancar el servidor
npm run dev            # o npm start
```

Servidor disponible en: `http://localhost:3000`

---

## 2. Estructura del proyecto

```bash
.
├── src/
│   ├── controllers/       # Procesan peticiones y responden HTTP
│   │   ├── user.controller.js
│   │   └── tarea.controller.js
│   ├── database/          # Conexión a MySQL (pool)
│   │   └── db.js
│   ├── data/              # Datos iniciales de referencia
│   │   ├── users.data.js
│   │   └── tareas.data.js
│   ├── models/            # Única capa que accede a la base de datos
│   │   ├── user.model.js
│   │   └── tarea.model.js
│   ├── routes/            # Definición de rutas y endpoints
│   │   ├── user.routes.js
│   │   └── tarea.routes.js
│   ├── seed/              # Script que inserta los datos iniciales
│   │   └── seed.js
│   └── app.js             # Configuración y middlewares de Express
├── docs/
│   └── NFR.md             # Requisitos No Funcionales (guía de cumplimiento)
├── .env.example           # Variables de entorno de ejemplo
├── .gitignore             # Archivos excluidos de Git (node_modules, .env)
├── database.sql           # Creación de la base de datos y tablas
├── package.json           # Dependencias y scripts
├── README.md              # Documentación técnica
└── server.js              # Punto de entrada y arranque del servidor
```

---

## 3. Capas y flujo de trabajo

- **Rutas (`src/routes/`)**: reciben la URL y delegan en el controlador. No tienen lógica de negocio.
- **Controladores (`src/controllers/`)**: validan la petición, llaman al modelo y construyen la respuesta JSON estandarizada.
- **Modelos (`src/models/`)**: únicos que ejecutan las consultas SQL sobre MySQL.
- **Base de datos**: `tareas_adso` con tablas `users` y `tareas` (definidas en `database.sql`).

Formato de respuesta estándar en todas las rutas:

```json
{ "success": true, "message": "Mensaje descriptivo", "data": [...], "errors": [] }
```

---

## 4. Endpoints

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

---

> 📌 **Requisitos No Funcionales:** consulta [docs/NFR.md](docs/NFR.md) para ver cómo se cumplen los RNF (arquitectura por capas, separación de responsabilidades, flujo de Git y Pull Requests) y cómo probar el sistema.
