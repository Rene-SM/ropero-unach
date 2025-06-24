const db = require('../config/db');

// ⚠️ Simulando que el usuario con ID 1 está autenticado
const usuarioAutenticado = 1;

exports.obtenerConversaciones = (req, res) => {
  const sql = `
    SELECT DISTINCT u.id_usuario, u.nombre, u.correo
    FROM Mensajes m
    JOIN Solicitudes s ON m.id_solicitud = s.id_solicitud
    JOIN Usuario u ON (u.id_usuario = s.id_usuario AND u.id_usuario != ?)
    WHERE s.id_usuario = ? OR s.id_producto IN (
      SELECT id_producto FROM Productos WHERE id_usuario = ?
    )
    ORDER BY m.fecha_envio DESC
  `;

  db.query(sql, [usuarioAutenticado, usuarioAutenticado, usuarioAutenticado], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const conversaciones = result.map((row) => ({
      receptor: row,
      ultimoMensaje: null
    }));
    res.json(conversaciones);
  });
};

exports.obtenerMensajes = (req, res) => {
  const idReceptor = req.params.idReceptor;

  const sql = `
    SELECT m.*, m.id_emisor = ? AS esPropio
    FROM Mensajes m
    JOIN Solicitudes s ON m.id_solicitud = s.id_solicitud
    WHERE (s.id_usuario = ? AND m.id_emisor = ?)
       OR (s.id_usuario = ? AND m.id_emisor = ?)
    ORDER BY m.fecha_envio ASC
  `;

  db.query(sql, [usuarioAutenticado, usuarioAutenticado, idReceptor, idReceptor, usuarioAutenticado], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

exports.enviarMensaje = (req, res) => {
  const { receptor, contenido } = req.body;

  const sqlSolicitud = `
    SELECT id_solicitud FROM Solicitudes
    WHERE (id_usuario = ? AND id_producto IN (
      SELECT id_producto FROM Productos WHERE id_usuario = ?
    )) OR (id_usuario = ? AND id_producto IN (
      SELECT id_producto FROM Productos WHERE id_usuario = ?
    ))
    LIMIT 1
  `;

  db.query(sqlSolicitud, [usuarioAutenticado, receptor, receptor, usuarioAutenticado], (err, solicitudRes) => {
    if (err) return res.status(500).json({ error: err.message });

    if (solicitudRes.length === 0) {
      return res.status(400).json({ error: 'No hay solicitud activa entre estos usuarios' });
    }

    const id_solicitud = solicitudRes[0].id_solicitud;

    const sqlInsert = `
      INSERT INTO Mensajes (id_solicitud, id_emisor, contenido)
      VALUES (?, ?, ?)
    `;

    db.query(sqlInsert, [id_solicitud, usuarioAutenticado, contenido], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const nuevoMensaje = {
        id_mensaje: result.insertId,
        id_solicitud,
        id_emisor: usuarioAutenticado,
        contenido,
        esPropio: true,
        fecha_envio: new Date()
      };

      res.json(nuevoMensaje);
    });
  });
};

exports.enviarMensajeConImagen = (req, res) => {
  const { receptor } = req.body;
  const imagen = req.file ? req.file.filename : null;

  if (!imagen) {
    return res.status(400).json({ error: 'No se recibió ninguna imagen' });
  }

  const sqlSolicitud = `
    SELECT id_solicitud FROM Solicitudes
    WHERE (id_usuario = ? AND id_producto IN (
      SELECT id_producto FROM Productos WHERE id_usuario = ?
    )) OR (id_usuario = ? AND id_producto IN (
      SELECT id_producto FROM Productos WHERE id_usuario = ?
    ))
    LIMIT 1
  `;

  db.query(sqlSolicitud, [usuarioAutenticado, receptor, receptor, usuarioAutenticado], (err, solicitudRes) => {
    if (err) return res.status(500).json({ error: err.message });

    if (solicitudRes.length === 0) {
      return res.status(400).json({ error: 'No hay solicitud activa entre estos usuarios' });
    }

    const id_solicitud = solicitudRes[0].id_solicitud;

    const sqlInsert = `
      INSERT INTO Mensajes (id_solicitud, id_emisor, contenido)
      VALUES (?, ?, ?)
    `;

    db.query(sqlInsert, [id_solicitud, usuarioAutenticado, imagen], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const nuevoMensaje = {
        id_mensaje: result.insertId,
        id_solicitud,
        id_emisor: usuarioAutenticado,
        contenido: imagen,
        esPropio: true,
        fecha_envio: new Date(),
        imagen: `uploads/chat/${imagen}`
      };

      res.json(nuevoMensaje);
    });
  });
};
