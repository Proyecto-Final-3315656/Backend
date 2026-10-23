CREATE DATABASE IF NOT EXISTS tareas_adso;

-- Cree el usuario de aplicación con una contraseña única fuera de este archivo.
-- Consulte README.md para otorgar únicamente SELECT, INSERT, UPDATE y DELETE.

USE tareas_adso;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(50) DEFAULT '',
    password_hash VARCHAR(255) NULL,
    rol ENUM('admin', 'usuario') NOT NULL DEFAULT 'usuario',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    descripcion TEXT NOT NULL,
    estado ENUM('Pendiente', 'En Proceso', 'Completada') DEFAULT 'Pendiente',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tarea_usuario FOREIGN KEY (idUsuario) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- Datos de prueba
-- ============================================================
INSERT IGNORE INTO users (nombre, email, telefono) VALUES
    ('Ana Torres',     'ana.torres@mail.com',     '300-123-4567'),
    ('Carlos Gómez',   'carlos.gomez@mail.com',   '300-234-5678'),
    ('María López',    'maria.lopez@mail.com',    '300-345-6789'),
    ('Juan Pérez',     'juan.perez@mail.com',     '300-456-7890'),
    ('Laura Martínez', 'laura.martinez@mail.com', '300-567-8901'),
    ('Pedro Sánchez',  'pedro.sanchez@mail.com',  '300-678-9012'),
    ('Sofía Ramírez',  'sofia.ramirez@mail.com',  '300-789-0123'),
    ('Andrés Morales', 'andres.morales@mail.com', '300-890-1234'),
    ('Valentina Cruz', 'valentina.cruz@mail.com', '300-901-2345'),
    ('Diego Herrera',  'diego.herrera@mail.com',  '300-012-3456');

INSERT INTO tareas (idUsuario, descripcion, estado)
SELECT 1, 'Preparar informe semanal de actividades', 'Pendiente'
WHERE NOT EXISTS (SELECT 1 FROM tareas WHERE idUsuario = 1 AND descripcion = 'Preparar informe semanal de actividades');

INSERT INTO tareas (idUsuario, descripcion, estado)
SELECT 2, 'Validar requisitos de la reunión de proyecto', 'En Proceso'
WHERE NOT EXISTS (SELECT 1 FROM tareas WHERE idUsuario = 2 AND descripcion = 'Validar requisitos de la reunión de proyecto');
