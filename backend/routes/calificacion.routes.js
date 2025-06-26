const express = require('express');
const router = express.Router();
const calificacionController = require('../controllers/calificacion.controller');

// Ruta para registrar una nueva calificación
router.post('/', calificacionController.crearCalificacion);

module.exports = router;
