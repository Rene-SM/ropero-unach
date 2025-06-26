const db = require('../config/db');

exports.crearCalificacion = (req, res) => {
  const {
    id_emisor,
    id_receptor,
    puntuacion,
    comentario,
    tipo_calificacion,
    id_transaccion // ahora lo aceptamos también
  } = req.body;

  // Validación básica (permitimos id_transaccion como null)
  if (!id_emisor || !id_receptor || !puntuacion || !comentario || !tipo_calificacion) {
    return res.status(400).json({ error: 'Faltan datos obligatorios.' });
  }

  // 🚫 Seguridad adicional: evitar auto-calificaciones
  if (id_emisor === id_receptor) {
    return res.status(403).json({ error: 'No puedes calificarte a ti mismo.' });
  }

  const sql = `
    INSERT INTO Calificaciones 
    (id_transaccion, id_emisor, id_receptor, puntuacion, comentario, tipo_calificacion) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [id_transaccion || null, id_emisor, id_receptor, puntuacion, comentario, tipo_calificacion],
    (err, result) => {
      if (err) {
        console.error('❌ Error al guardar calificación:', err);
        return res.status(500).json({ error: 'Error al guardar la calificación.' });
      }

      res.status(201).json({ success: true, message: 'Calificación registrada correctamente.' });
    }
  );
};
