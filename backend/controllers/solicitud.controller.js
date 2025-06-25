const db = require('../config/db');

// Crear o reutilizar solicitud entre comprador y producto
exports.iniciarConversacion = async (req, res) => {
  const { id_producto, id_usuario } = req.body;

  try {
    // Buscar si ya existe una solicitud pendiente o aceptada
    const [solicitudesExistentes] = await db.query(
      `SELECT * FROM Solicitudes 
       WHERE id_producto = ? AND id_usuario = ? 
       AND estado IN ('pendiente', 'aceptada')`,
      [id_producto, id_usuario]
    );

    if (solicitudesExistentes.length > 0) {
      // Ya existe, la reutilizamos
      return res.json(solicitudesExistentes[0]);
    }

    // Crear nueva solicitud (tipo compra por defecto)
    const [resultado] = await db.query(
      `INSERT INTO Solicitudes (id_producto, id_usuario, tipo_solicitud, estado)
       VALUES (?, ?, 'compra', 'pendiente')`,
      [id_producto, id_usuario]
    );

    const id_solicitud = resultado.insertId;

    // Devolver la solicitud nueva
    const [nuevaSolicitud] = await db.query(
      `SELECT * FROM Solicitudes WHERE id_solicitud = ?`,
      [id_solicitud]
    );

    res.json(nuevaSolicitud[0]);

  } catch (error) {
    console.error('Error al iniciar conversación:', error);
    res.status(500).json({ mensaje: 'Error al iniciar conversación' });
  }
};

