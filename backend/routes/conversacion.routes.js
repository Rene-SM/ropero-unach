const express = require('express');
const router = express.Router();
const controller = require('../controllers/conversacion.controller');

// ✅ Crear nueva conversación (si no existe)
router.post('/iniciar', controller.iniciarConversacion);

// ✅ Obtener todas las conversaciones del usuario autenticado
router.get('/', controller.obtenerConversaciones);

// ✅ Obtener mensajes de una conversación específica
router.get('/:id/mensajes', controller.obtenerMensajes);

// ✅ Enviar mensaje a una conversación existente
router.post('/:id/mensajes', controller.enviarMensaje);

module.exports = router;
