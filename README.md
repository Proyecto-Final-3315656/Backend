# API de tareas ADSO

API REST con Node.js, Express y MySQL. Su arquitectura es `server -> app -> routes -> controllers -> models -> MySQL`.

## Requisitos

- Node.js 20 o superior.
- MySQL 8 o superior.
- Un usuario MySQL de aplicación; no use `root`.

## Instalación

1. Cree la base inicial ejecutando `database.sql` con una cuenta administradora de MySQL.
2. Cree una cuenta limitada para la API. Sustituya los valores entre comillas por secretos únicos:

```sql
CREATE USER 'tareas_app'@'localhost' IDENTIFIED BY 'una-contrasena-larga-y-unica';
GRANT SELECT, INSERT, UPDATE, DELETE ON tareas_adso.* TO 'tareas_app'@'localhost';
FLUSH PRIVILEGES;
```

3. Copie `.env.example` a `.env`, complete los secretos y ejecute `npm install`.
4. Si ya tenía una base creada con la versión anterior, ejecute una sola vez `npm run migrate` antes de iniciar la API. El script conserva los datos, agrega seguridad e informa si encuentra correos duplicados que deban corregirse.
5. Cree o actualice la primera cuenta administradora:

```bash
npm run bootstrap:admin -- admin@ejemplo.com una-contrasena-de-al-menos-12-caracteres "Administrador"
```

6. Inicie el servidor con `npm run dev`. La comprobación de conexión evita que la API inicie si MySQL no está disponible o la configuración es insegura.

Para servir la build desde Express, ejecute `npm run build` en `C:\fronted\Frontend-\Modulos`. La ruta actual se detecta automáticamente; en otra estructura configure `FRONTEND_PATH` con la carpeta `dist`.

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto HTTP, por defecto `3000`. |
| `DB_HOST`, `DB_PORT`, `DB_NAME` | Ubicación de MySQL. |
| `DB_USER`, `DB_PASSWORD` | Cuenta limitada de la aplicación. `DB_USER=root` se rechaza. |
| `JWT_SECRET` | Secreto aleatorio de 32 caracteres o más. |
| `CORS_ORIGIN` | Origen del frontend, por ejemplo `http://localhost:5173`. |
| `FRONTEND_PATH` | Opcional: carpeta `dist` del frontend que Express debe servir. |

## Autenticación y roles

- `POST /api/auth/login`: inicia sesión con correo y contraseña.
- `GET /api/auth/me`: valida la sesión actual.
- `admin`: administra usuarios y todas las tareas.
- `usuario`: solo crea, consulta, actualiza y elimina sus propias tareas.

Todas las rutas `/api/usuarios` y `/api/tareas` requieren `Authorization: Bearer <token>`.

## Endpoints

| Método | Ruta | Rol |
| --- | --- | --- |
| `GET`, `POST` | `/api/usuarios` | admin |
| `GET`, `PATCH`, `DELETE` | `/api/usuarios/:id` | admin |
| `GET`, `POST` | `/api/tareas` | autenticado |
| `GET`, `PATCH`, `DELETE` | `/api/tareas/:id` | propietario o admin |
| `GET` | `/api/health` | público |

Las respuestas tienen la forma `{ success, message, data, errors }`. La eliminación de un usuario se ejecuta en transacción y elimina sus tareas asociadas mediante la clave foránea en cascada.

## Calidad

```bash
npm test
```

El proyecto incluye validación con Zod, hash de contraseñas con bcrypt, JWT, rate limiting, CORS limitado y cabeceras Helmet.
