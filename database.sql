CREATE DATABASE IF NOT EXISTS tareas_adso;
USE tareas_adso;

-- ========================================
-- TABLA 1: usuarios
-- ========================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(20)
);

-- ========================================
-- TABLA 2: proyectos
-- ========================================
CREATE TABLE proyectos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_usuario INT
);

-- ========================================
-- TABLA 3: tareas
-- ========================================
CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT DEFAULT NULL,
    nombreUsuario VARCHAR(100) DEFAULT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'Pendiente',
    id_proyecto INT
);

-- ========================================
-- TABLA 4: categorias
-- ========================================
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    color VARCHAR(20)
);

-- ========================================
-- TABLA 5: notas
-- ========================================
CREATE TABLE notas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contenido TEXT NOT NULL,
    id_tarea INT,
    id_usuario INT
);

-- ========================================
-- DATOS DE PRUEBA (5 registros por tabla)
-- ========================================

-- Usuarios
INSERT INTO usuarios (nombre, email, telefono) VALUES
('Ana Torres', 'ana.torres@mail.com', '3001234567'),
('Carlos Gomez', 'carlos.gomez@mail.com', '3002345678'),
('Maria Lopez', 'maria.lopez@mail.com', '3003456789'),
('Juan Perez', 'juan.perez@mail.com', '3004567890'),
('Laura Martinez', 'laura.martinez@mail.com', '3005678901'),
('Pedro Sanchez', 'pedro.sanchez@mail.com', '3006789012'),
('Sofia Ramirez', 'sofia.ramirez@mail.com', '3007890123'),
('Andres Morales', 'andres.morales@mail.com', '3008901234'),
('Valentina Cruz', 'valentina.cruz@mail.com', '3009012345'),
('Diego Herrera', 'diego.herrera@mail.com', '3010123456'),
('Camila Rios', 'camila.rios@mail.com', '3011234567'),
('Mateo Vargas', 'mateo.vargas@mail.com', '3012345678'),
('Isabella Moreno', 'isabella.moreno@mail.com', '3013456789'),
('Santiago Luna', 'santiago.luna@mail.com', '3014567890'),
('Emma Gutierrez', 'emma.gutierrez@mail.com', '3015678901');

-- Proyectos
INSERT INTO proyectos (nombre, descripcion, id_usuario) VALUES
('App Movil', 'Desarrollo de aplicacion movil', 1),
('Pagina Web', 'Creacion de sitio web institucional', 2),
('API Backend', 'Implementacion de API REST', 3),
('Base de Datos', 'Diseno de base de datos', 4),
('Documentacion', 'Elaboracion de documentacion tecnica', 5);

-- Tareas
-- Se asocian a un usuario real (idUsuario + nombreUsuario) para que nunca
--quede una tarea sin dueño (caso de columnas NULL antes). El idUsuario
--coincide con el id del usuario dueño del proyecto correspondiente.
INSERT INTO tareas (idUsuario, nombreUsuario, titulo, descripcion, estado, id_proyecto) VALUES
(1, 'Ana Torres',    'Disenar interfaz',      'Crear wireframes de la app',    'Pendiente',  1),
(3, 'Maria Lopez',   'Configurar servidor',   'Instalar y configurar Node.js', 'Completada', 3),
(3, 'Maria Lopez',   'Crear endpoints',       'Desarrollar rutas de la API',   'En Proceso', 3),
(4, 'Juan Perez',    'Diseñar base de datos', 'Crear tablas y relaciones',     'Pendiente',  4),
(5, 'Laura Martinez','Redactar manual',       'Escribir guia de usuario',      'Pendiente',  5);

-- Categorias
INSERT INTO categorias (nombre, color) VALUES
('Urgente', 'Rojo'),
('Normal', 'Azul'),
('Baja', 'Verde'),
('En Revision', 'Amarillo'),
('Archivado', 'Gris');

-- Notas
INSERT INTO notas (contenido, id_tarea, id_usuario) VALUES
('Revisar colores con el cliente', 1, 1),
('Usar la version 18 de Node', 2, 3),
('Priorizar GET y POST primero', 3, 3),
('Incluir clave foranea en usuario', 4, 4),
('Agregar imagenes al manual', 5, 5);
