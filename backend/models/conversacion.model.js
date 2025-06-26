const db = require('../config/db');

const Conversacion = {};

// Crear conversación si no existe
Conversacion.crear = (idUsuario1, idUsuario2, callback) => {
  const sql = `
    INSERT INTO Conversaciones (id_usuario_1, id_usuario_2)
    VALUES (?, ?)
  `;
  db.query(sql, [idUsuario1, idUsuario2], callback);
};

// Buscar si ya existe una conversación entre dos usuarios
Conversacion.buscarExistente = (idUsuario1, idUsuario2, callback) => {
  const sql = `
    SELECT * FROM Conversaciones
    WHERE (id_usuario_1 = ? AND id_usuario_2 = ?)
       OR (id_usuario_1 = ? AND id_usuario_2 = ?)
  `;
  db.query(sql, [idUsuario1, idUsuario2, idUsuario2, idUsuario1], callback);
};

// Obtener todas las conversaciones de un usuario
Conversacion.obtenerPorUsuario = (idUsuario, callback) => {
  const sql = `
    SELECT c.id_conversacion, u.id_usuario, u.nombre, u.imagen
    FROM Conversaciones c
    JOIN Usuario u ON u.id_usuario = IF(c.id_usuario_1 = ?, c.id_usuario_2, c.id_usuario_1)
    WHERE c.id_usuario_1 = ? OR c.id_usuario_2 = ?
    ORDER BY c.fecha_inicio DESC
  `;
  db.query(sql, [idUsuario, idUsuario, idUsuario], callback);
};

module.exports = Conversacion;
