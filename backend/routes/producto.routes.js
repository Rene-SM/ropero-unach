console.log('✅ archivo producto.routes.js cargado');

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ProductoController = require('../controllers/producto.controller');
const verificarToken = require('../middlewares/auth.middleware');

// Configuración de multer (para imágenes futuras)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const nombreUnico = Date.now() + '-' + file.originalname;
    cb(null, nombreUnico);
  }
});
const upload = multer({ storage });

// ✅ Crear un producto
router.post('/', verificarToken, upload.array('imagenes', 5), ProductoController.crearProducto);

// Ruta base de prueba
router.get('/', (req, res) => {
  res.send('Ruta de productos funcionando');
});

// ✅ Crear un producto (DUPLICADA — ya no necesaria, pero si decides dejarla, coméntala)
router.post('/', upload.array('imagenes', 5), ProductoController.crearProducto);

// ✅ Listar todos los productos
router.get('/listar', ProductoController.obtenerProductos);

// ✅ Obtener productos de la categoría "Ropa"
router.get('/ropa', ProductoController.obtenerRopaGeneral);

// ✅ Obtener productos de la categoría "Accesorios"
router.get('/accesorios', ProductoController.obtenerAccesorios);

// ✅ Ruta para obtener productos donados a la comunidad
router.get('/donaciones-comunidad', ProductoController.obtenerDonacionesComunidad);

// ✅ Nueva ruta para obtener publicaciones por usuario
router.get('/publicaciones/:idUsuario', ProductoController.obtenerPublicacionesPorUsuario);

// ✅ NUEVA RUTA para historial de moderación (DEBE IR ANTES que /:id)
router.get('/historial-moderacion', ProductoController.obtenerHistorialModeracion);

// ✅ Obtener un producto por su ID (para el detalle del producto)
router.get('/:id', ProductoController.obtenerProductoPorId);

// ✅ NUEVA RUTA para eliminar productos por ID (solo admin debe usarla)
router.delete('/:id', ProductoController.eliminarProducto);

// Ruta de prueba
router.get('/prueba', (req, res) => {
  res.json({ mensaje: 'Ruta /prueba activa ✔️' });
});

module.exports = router;
