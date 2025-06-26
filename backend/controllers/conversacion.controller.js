const db = require('../config/db');
const Conversacion = require('../models/conversacion.model');

// Iniciar conversación o devolver la existente
exports.iniciarConversacion = (req, res) => {
  const { id_receptor, id_emisor } = req.body;

  if (!id_receptor || !id_emisor) {
    return res.status(400).json({ error: 'Faltan datos del emisor o receptor' });
  }

  Conversacion.buscarExistente(id_emisor, id_receptor, (err, resultado) => {
    if (err) return res.status(500).json({ error: 'Error buscando conversación' });

    if (resultado.length > 0) {
      return res.status(200).json({ conversacion: resultado[0] });
    }

    Conversacion.crear(id_emisor, id_receptor, (err, result) => {
      if (err) return res.status(500).json({ error: 'Error creando conversación' });

      res.status(201).json({
        conversacion: {
          id_conversacion: result.insertId,
          id_usuario_1: id_emisor,
          id_usuario_2: id_receptor
        }
      });
    });
  });
};

// Obtener todas las conversaciones del usuario
exports.obtenerConversaciones = (req, res) => {
  const id_emisor = Number(req.query.id_emisor); // se puede pasar como query param

  if (!id_emisor) {
    return res.status(400).json({ error: 'Falta el id del usuario autenticado' });
  }

  Conversacion.obtenerPorUsuario(id_emisor, (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error al obtener conversaciones' });

    const conversaciones = resultados.map((fila) => ({
      id_conversacion: fila.id_conversacion,
      receptor: {
        id_usuario: fila.id_usuario,
        nombre: fila.nombre,
        imagen: fila.imagen
      }
    }));

    res.json(conversaciones);
  });
};

// Obtener mensajes de una conversación
exports.obtenerMensajes = (req, res) => {
  const id_conversacion = req.params.id;
  const id_emisor = Number(req.query.id_emisor); // opcionalmente desde query

  if (!id_conversacion || !id_emisor) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const sql = `
    SELECT *, id_emisor = ? AS esPropio
    FROM Mensajes
    WHERE id_conversacion = ?
    ORDER BY fecha_envio ASC
  `;

  db.query(sql, [id_emisor, id_conversacion], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al obtener mensajes' });
    res.json(result);
  });
};

// Enviar un mensaje
exports.enviarMensaje = (req, res) => {
  const id_conversacion = req.params.id;
  const { contenido, id_emisor } = req.body;

  if (!contenido || !id_emisor) {
    return res.status(400).json({ error: 'Faltan datos del mensaje' });
  }

  const sql = `
    INSERT INTO Mensajes (id_conversacion, id_emisor, contenido)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [id_conversacion, id_emisor, contenido], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al enviar mensaje' });

    res.status(201).json({
      id_mensaje: result.insertId,
      id_conversacion,
      id_emisor,
      contenido,
      esPropio: true,
      fecha_envio: new Date()
    });
  });
};

// Enviar mensaje con imagen
exports.enviarMensajeConImagen = (req, res) => {
  const id_conversacion = req.params.id;
  const archivo = req.file;
  const id_emisor = Number(req.body.id_emisor);

  if (!archivo || !id_emisor) {
    return res.status(400).json({ error: 'Faltan datos de imagen o emisor' });
  }

  const sql = `
    INSERT INTO Mensajes (id_conversacion, id_emisor, imagen)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [id_conversacion, id_emisor, archivo.filename], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al enviar imagen' });

    res.status(201).json({
      id_mensaje: result.insertId,
      id_conversacion,
      id_emisor,
      imagen: archivo.filename,
      esPropio: true,
      fecha_envio: new Date()
    });
  });
};
