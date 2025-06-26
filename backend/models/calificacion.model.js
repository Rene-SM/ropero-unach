// Modelo base para posibles futuras funciones
const db = require('../config/db');

const Calificacion = {
  crear: (datos, callback) => {
    const sql = `
      INSERT INTO Calificaciones 
      (id_emisor, id_receptor, puntuacion, comentario, tipo_calificacion) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      datos.id_emisor,
      datos.id_receptor,
      datos.puntuacion,
      datos.comentario,
      datos.tipo_calificacion
    ];
    db.query(sql, params, callback);
  }
};

module.exports = Calificacion;
