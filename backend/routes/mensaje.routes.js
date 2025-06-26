const express = require('express');
const router = express.Router();
const mensajesController = require('../controllers/conversacion.controller'); // corregido

// 📦 Configuración para subir imágenes de chat
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Asegura que exista el directorio
const dir = 'uploads/chat/';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// 📥 Obtener lista de conversaciones del usuario autenticado
router.get('/conversaciones', mensajesController.obtenerConversaciones);

// 📄 Obtener mensajes con un usuario específico (modo directo)
router.get('/conversacion/:idReceptor', mensajesController.obtenerMensajes);

// 🟢 Enviar mensaje de texto
router.post('/enviar/:id', mensajesController.enviarMensaje);

// 🟡 Enviar mensaje con imagen
router.post('/enviar-imagen/:id', upload.single('imagen'), mensajesController.enviarMensajeConImagen);

// (Si vas a usarlo en el futuro)
// router.get('/por-solicitud/:id', mensajesController.obtenerMensajesPorSolicitud);

module.exports = router;
