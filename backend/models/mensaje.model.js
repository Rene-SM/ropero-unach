const db = require('../config/db');

const Mensaje = {};

// 📩 Crear un mensaje de texto
Mensaje.crear = (datos, callback) => {
  const sql = `
    INSERT INTO Mensajes (id_solicitud, id_emisor, contenido)
    VALUES (?, ?, ?)
  `;
  db.query(sql, [datos.id_solicitud, datos.id_emisor, datos.contenido], callback);
};

// 📥 Obtener todos los mensajes de una solicitud
Mensaje.obtenerPorSolicitud = (id_solicitud, callback) => {
  const sql = `
    SELECT m.*, u.nombre, u.imagen
    FROM Mensajes m
    JOIN Usuario u ON u.id_usuario = m.id_emisor
    WHERE m.id_solicitud = ?
    ORDER BY m.fecha_envio ASC
  `;
  db.query(sql, [id_solicitud], callback);
};

// 📜 Obtener la última solicitud entre dos usuarios
Mensaje.buscarSolicitudExistente = (idUsuario1, idUsuario2, callback) => {
  const sql = `
    SELECT s.*
    FROM Solicitudes s
    JOIN Productos p ON p.id_producto = s.id_producto
    WHERE (s.id_usuario = ? AND p.id_usuario = ?)
       OR (s.id_usuario = ? AND p.id_usuario = ?)
    ORDER BY s.fecha DESC
    LIMIT 1
  `;
  db.query(sql, [idUsuario1, idUsuario2, idUsuario2, idUsuario1], callback);
};

// 🔍 Obtener las conversaciones activas del usuario autenticado
Mensaje.obtenerConversaciones = (idUsuario, callback) => {
  const sql = `
    SELECT DISTINCT u.id_usuario, u.nombre, u.imagen
    FROM Mensajes m
    JOIN Solicitudes s ON m.id_solicitud = s.id_solicitud
    JOIN Productos p ON p.id_producto = s.id_producto
    JOIN Usuario u ON (u.id_usuario = s.id_usuario OR u.id_usuario = p.id_usuario)
    WHERE (s.id_usuario = ? OR p.id_usuario = ?) AND u.id_usuario != ?
    ORDER BY m.fecha_envio DESC
  `;
  db.query(sql, [idUsuario, idUsuario, idUsuario], callback);
};

module.exports = Mensaje;
