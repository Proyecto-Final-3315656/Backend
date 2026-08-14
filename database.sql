CREATE DATABASE IF NOT EXISTS tareas_adso;

CREATE USER IF NOT EXISTS 'Grupo3'@'localhost' IDENTIFIED BY '12345';
GRANT ALL PRIVILEGES ON tareas_adso.* TO 'Grupo3'@'localhost';
FLUSH PRIVILEGES;

USE tareas_adso;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(50) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    nombreUsuario VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    estado ENUM('Pendiente', 'En Proceso', 'Completada') DEFAULT 'Pendiente',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tarea_usuario FOREIGN KEY (idUsuario) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================================
-- Datos de prueba
-- ============================================================
INSERT INTO users (nombre, email, telefono) VALUES
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

INSERT INTO tareas (idUsuario, nombreUsuario, descripcion, estado) VALUES
    (1, 'Ana Torres',   'Sed minus ducimus r',      'Pendiente'),
    (1, 'Ana Torres',   'Ut libero dolore tem',     'Pendiente'),
    (2, 'Carlos Gómez', 'tareas Editar',            'Pendiente');
