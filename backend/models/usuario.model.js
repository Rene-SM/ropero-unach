const db = require('../config/db'); // Pool de conexión mysql2/promise

/**
 * Utilidad interna: ejecuta una consulta con parámetros
 * y responde con callback estilo Node.js (err, resultado)
 */
const ejecutar = (sql, params, cb) => {
  db.execute(sql, params)
    .then(([rows]) => cb(null, rows))
    .catch((err) => cb(err));
};

const Usuario = {
  // Crear un nuevo usuario
  crear: (nuevoUsuario, callback) => {
    const sql = `
      INSERT INTO Usuario
        (nombre, apellidos, rut, celular, fecha_nacimiento, tipo, correo, contraseña)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      nuevoUsuario.nombre,
      nuevoUsuario.apellidos,
      nuevoUsuario.rut,
      nuevoUsuario.celular,
      nuevoUsuario.fecha_nacimiento,
      nuevoUsuario.tipo,
      nuevoUsuario.correo,
      nuevoUsuario.contraseña
    ];
    ejecutar(sql, params, callback);
  },

  // Buscar usuario por correo (para login o verificación)
  buscarPorCorreo: (correo, callback) => {
    const sql = 'SELECT * FROM Usuario WHERE correo = ?';
    ejecutar(sql, [correo], callback);
  }

  // Podrías agregar aquí funciones como:
  // buscarPorId: (id, cb) => { ... }
};

module.exports = Usuario;
