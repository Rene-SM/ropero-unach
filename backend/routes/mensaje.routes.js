const express = require('express');
const router = express.Router();
const mensajesController = require('../controllers/mensaje.controller');

// Envío de archivos
const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento para imágenes de chat
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/chat/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Obtener todas las conversaciones del usuario autenticado
router.get('/conversaciones', mensajesController.obtenerConversaciones);

// Obtener los mensajes con otro usuario específico
router.get('/conversacion/:idReceptor', mensajesController.obtenerMensajes);

// Enviar un nuevo mensaje de texto
router.post('/enviar', mensajesController.enviarMensaje);

// Enviar un nuevo mensaje con imagen
router.post('/enviar-imagen', upload.single('imagen'), mensajesController.enviarMensajeConImagen);

module.exports = router;
