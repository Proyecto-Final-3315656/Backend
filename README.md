# API de Tareas - Administrador de Tareas ADSO (Grupo 3)

API de gestión de **usuarios** y **tareas** con **Node.js**, **Express**, **MySQL** y **ES Modules**.
Sirve también la build del frontend (Vite) y se conecta a la base de datos `tareas_adso`.

---

## Como abrir el proyecto en otro computador

> Requisitos: tener instalados **Node.js** y **MySQL**, y haber copiado o clonado
> las carpetas `Backend` y `Frontend-`. MySQL debe estar encendido antes de iniciar
> el backend.

1. **Crear la base de datos una sola vez.** Abre MySQL con un usuario administrador
   y ejecuta `Backend/database.sql`. El script crea `tareas_adso`, el usuario
   `Grupo3` y las tablas necesarias.

2. **Configurar dependencias:**
   ```bash
   # En la carpeta del BACKEND:
   setup.bat
   ```
   El script instala las dependencias del backend y del frontend, crea el
   archivo `.env` desde `.env.example` (si no existe) y comprueba la conexión
   a la base de datos. Si las carpetas están en las rutas habituales, usa por
   defecto `C:\backend\Backend` y `C:\fronted\Frontend-\Modulos`.

3. **Levantar el backend** (Terminal 1):
   ```bash
   cd ruta\Backend
   npm run dev
   ```

4. **Levantar el frontend** (Terminal 2):
   ```bash
   cd ruta\Modulos
   npm run dev
   ```

5. **Abrir el navegador en:** `http://localhost:5173`

> **Notas:**
> - El archivo `.env` **no se sube a git** (está en `.gitignore`). Si clonas el
>   repo, el `setup.bat` lo crea automáticamente con `Grupo3` / `12345`.
> - Si tu MySQL usa otras credenciales, edita el `.env` (variables `DB_USER`,
>   `DB_PASSWORD`, `DB_NAME`).
> - Ejecuta los comandos del frontend dentro de `Frontend-\Modulos`; el
>   `package.json` de la carpeta raíz no inicia la aplicación.
> - El servidor solo abre el puerto después de comprobar MySQL. Si falla, verás
>   el error exacto en la terminal.

---

# Historial del proyecto (documentación original)

# API de Productos - Arquitectura en Capas (Persistencia en Memoria)

Bienvenido a este proyecto de aprendizaje. El objetivo de esta API es comprender el flujo de la información en el backend utilizando **Node.js** y **ES Modules**. 

Para enfocarnos 100% en la lógica de programación y la estructura del proyecto, esta primera versión utiliza **persistencia en memoria** (un arreglo de datos) en lugar de un motor de base de datos tradicional. Esto nos permite aislar el aprendizaje de la arquitectura antes de introducir la complejidad de SQL.

---

## 1. Instalación y Configuración Inicial

Para poner en marcha este proyecto, primero debemos inicializar nuestro entorno de Node e instalar las herramientas necesarias.

### Comandos de instalación:
```bash
# 1. Inicializar el proyecto (crea el package.json)
npm init -y

# 2. Instalar el framework principal
npm install express

# 3. Instalar la herramienta de desarrollo (como dependencia de desarrollo)
npm install -D nodemon
``
## 2. Estructura Jerárquica del Proyecto

Para poner en marcha este proyecto, primero debemos inicializar nuestro entorno de Node e instalar las herramientas necesarias.
`
```
## 2. Estructura Jerárquica del Proyecto

La siguiente estructura organiza el código fuente separando la configuración global de la lógica de negocio y el almacenamiento de datos.

```bash
.
├── src/
│   ├── controllers/
│   │   └── product.controller.js    # Manejo de peticiones y respuestas HTTP
│   ├── data/
│   │   └── products.data.js         # Fuente de datos (Arreglo en memoria)
│   ├── models/
│   │   └── product.model.js         # Lógica de acceso y manipulación de datos
│   ├── routes/
│   │   └── product.routes.js        # Definición de rutas y endpoints
│   └── app.js                       # Configuración y middlewares de Express
├── .gitignore                       # Archivos excluidos de Git (node_modules, .env)
├── package.json                     # Dependencias y scripts del proyecto
├── README.md                        # Documentación técnica
└── server.js                        # Punto de entrada y arranque del servidor

```

### 3. Guía de Componentes y Capas

Para que nuestro código sea ordenado y profesional, dividimos las tareas en diferentes "capas". Así es como funciona cada una:

* **Raíz (`/`):** Es la base del proyecto. Aquí se encuentra el archivo **`server.js`**, que funciona únicamente como el **"interruptor"** de encendido. Su única misión es importar la configuración de la aplicación (`app.js`) y dar la orden de inicio para que el servidor empiece a escuchar peticiones.

* **Carpeta `src/` (Source):** Es el corazón del proyecto donde vive todo nuestro código fuente.
    * **`app.js` (El Motor):** Aquí es donde realmente **se configura el servidor**. Es el encargado de preparar a Express, instalar las herramientas de lectura (como el formato JSON) y conectar las rutas globales. Sin este archivo, el servidor no sabría cómo procesar la información.

* **Capas Internas (El flujo de trabajo):**
    * **Routes (Rutas):** Es la "recepción" de nuestra API. Su trabajo es recibir la visita del usuario (la URL) y decidir a qué oficina (Controlador) debe enviarlo según lo que necesite hacer.
    * **Controllers (Controladores):** Es el "cerebro" que toma las decisiones. Recibe los datos que envía el usuario, le pide ayuda al Modelo para procesarlos y finalmente responde al cliente con un mensaje de éxito o de error.
    * **Models (Modelos):** Es el "especialista" en los datos. Es el único que sabe cómo buscar, filtrar o eliminar información. El resto de la aplicación no toca los datos directamente; siempre le pide el favor al Modelo.
    * **Data (Almacén):** Es nuestra "bodega" temporal. Aquí guardamos el arreglo de objetos con nuestros productos. En esta etapa, los datos viven en la memoria, lo que nos permite practicar antes de usar una base de datos real.
