const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitud.controller');

// 👉 Ruta para crear o reutilizar una solicitud
router.post('/iniciar', solicitudController.iniciarConversacion);

module.exports = router;
