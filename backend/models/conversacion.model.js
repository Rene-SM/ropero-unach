const db = require('../config/db');

const Conversacion = {};

// Crear conversación si no existe
Conversacion.crear = (idUsuario1, idUsuario2, callback) => {
  const sql = `
    INSERT INTO Conversaciones (id_usuario_1, id_usuario_2)
    VALUES (?, ?)
  `;
  console.log('🆕 Creando nueva conversación entre:', idUsuario1, 'y', idUsuario2);
  
  db.query(sql, [idUsuario1, idUsuario2], (err, result) => {
    if (err) {
      console.error('❌ Error al crear conversación:', err);
      return callback(err, null);
    }
    console.log('✅ Conversación creada con ID:', result.insertId);
    callback(null, result);
  });
};

// Buscar si ya existe una conversación entre dos usuarios
Conversacion.buscarExistente = (idUsuario1, idUsuario2, callback) => {
  const sql = `
    SELECT * FROM Conversaciones
    WHERE (id_usuario_1 = ? AND id_usuario_2 = ?)
       OR (id_usuario_1 = ? AND id_usuario_2 = ?)
  `;
  console.log('🔍 Buscando conversación entre:', idUsuario1, 'y', idUsuario2);
  console.log('📤 Query a ejecutar:', sql);
  console.log('📤 Parámetros:', [idUsuario1, idUsuario2, idUsuario2, idUsuario1]);

  try {
    db.query(sql, [idUsuario1, idUsuario2, idUsuario2, idUsuario1], (err, rows) => {
      if (err) {
        console.error('❌ Error ejecutando query buscarExistente:', err);
        return callback(err, null);
      }
      console.log('📦 Resultado de búsqueda:', rows);
      callback(null, rows);
    });
  } catch (error) {
    console.error('🔥 Error inesperado en buscarExistente:', error);
    callback(error, null);
  }
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
  console.log('📨 Obteniendo conversaciones del usuario:', idUsuario);

  db.query(sql, [idUsuario, idUsuario, idUsuario], (err, rows) => {
    if (err) {
      console.error('❌ Error al obtener conversaciones:', err);
      return callback(err, null);
    }
    console.log('📋 Conversaciones encontradas:', rows.length);
    callback(null, rows);
  });
};

module.exports = Conversacion;
