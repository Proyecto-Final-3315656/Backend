-- Ejecutar una sola vez sobre una base de datos existente. No elimina datos.
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL AFTER telefono;
ALTER TABLE users ADD COLUMN rol ENUM('admin', 'usuario') NOT NULL DEFAULT 'usuario' AFTER password_hash;
ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);

ALTER TABLE tareas DROP COLUMN nombreUsuario;
ALTER TABLE tareas DROP FOREIGN KEY fk_tarea_usuario;
ALTER TABLE tareas ADD CONSTRAINT fk_tarea_usuario FOREIGN KEY (idUsuario) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;
