// backend/controllers/conversacion.controller.js
const db = require('../config/db');

// ⚠️ Simular ID autenticado (reemplázalo con auth real más adelante)
const usuarioAutenticado = 1;

// Crear una nueva conversación si no existe ya
exports.iniciarConversacion = async (req, res) => {
  const { id_receptor } = req.body;
  if (!id_receptor) return res.status(400).json({ error: 'Receptor requerido' });

  try {
    const [existe] = await db.query(
      `SELECT * FROM Conversaciones WHERE 
       (id_usuario1 = ? AND id_usuario2 = ?) OR 
       (id_usuario1 = ? AND id_usuario2 = ?)`,
      [usuarioAutenticado, id_receptor, id_receptor, usuarioAutenticado]
    );

    if (existe.length > 0) {
      return res.status(200).json({ conversacion: existe[0], mensaje: 'Conversación ya existe' });
    }

    const [resultado] = await db.query(
      `INSERT INTO Conversaciones (id_usuario1, id_usuario2) VALUES (?, ?)`,
      [usuarioAutenticado, id_receptor]
    );

    const nuevaConversacion = {
      id_conversacion: resultado.insertId,
      id_usuario1: usuarioAutenticado,
      id_usuario2: id_receptor
    };

    res.status(201).json({ conversacion: nuevaConversacion });

  } catch (error) {
    console.error('❌ Error al iniciar conversación:', error);
    res.status(500).json({ error: 'Error al iniciar conversación' });
  }
};

// Obtener conversaciones del usuario actual
exports.obtenerConversaciones = async (req, res) => {
  try {
    const [resultados] = await db.query(
      `SELECT c.*, u.id_usuario, u.nombre, u.imagen
       FROM Conversaciones c
       JOIN Usuario u ON (u.id_usuario = IF(c.id_usuario1 = ?, c.id_usuario2, c.id_usuario1))
       WHERE c.id_usuario1 = ? OR c.id_usuario2 = ?
       ORDER BY c.fecha_ultima DESC`,
      [usuarioAutenticado, usuarioAutenticado, usuarioAutenticado]
    );

    const conversaciones = resultados.map((fila) => ({
      id_conversacion: fila.id_conversacion,
      receptor: {
        id_usuario: fila.id_usuario,
        nombre: fila.nombre,
        imagen: fila.imagen
      }
    }));

    res.json(conversaciones);

  } catch (error) {
    console.error('❌ Error al obtener conversaciones:', error);
    res.status(500).json({ error: 'Error al obtener conversaciones' });
  }
};

// Obtener mensajes de una conversación
exports.obtenerMensajes = async (req, res) => {
  const id = req.params.id;

  try {
    const [mensajes] = await db.query(
      `SELECT *, id_emisor = ? AS esPropio
       FROM Mensajes
       WHERE id_conversacion = ?
       ORDER BY fecha_envio ASC`,
      [usuarioAutenticado, id]
    );

    res.json(mensajes);

  } catch (error) {
    console.error('❌ Error al obtener mensajes:', error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
};

// Enviar mensaje de texto
exports.enviarMensaje = async (req, res) => {
  const id = req.params.id;
  const { contenido } = req.body;

  if (!contenido) return res.status(400).json({ error: 'Contenido requerido' });

  try {
    const [resultado] = await db.query(
      `INSERT INTO Mensajes (id_conversacion, id_emisor, contenido)
       VALUES (?, ?, ?)`,
      [id, usuarioAutenticado, contenido]
    );

    const nuevo = {
      id_mensaje: resultado.insertId,
      id_conversacion: id,
      id_emisor: usuarioAutenticado,
      contenido,
      esPropio: true,
      fecha_envio: new Date()
    };

    res.status(201).json(nuevo);

  } catch (error) {
    console.error('❌ Error al enviar mensaje:', error);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
};
