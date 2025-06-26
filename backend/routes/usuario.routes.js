const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const validarImagen = require('../middlewares/validarImagen');

// 🧪 Ruta de prueba
router.get('/', (req, res) => {
  res.send('Ruta de usuarios funcionando');
});

// 🟢 Registro de usuario
router.post(
  '/registrar',
  (req, res, next) => {
    console.log('🟢 Llegó a /registrar');
    next();
  },
  usuarioController.registrar
);

// 🔐 Inicio de sesión
router.post('/login', usuarioController.login);

// 🔍 Verificaciones de correo y RUT
router.get('/verificar', usuarioController.verificarCorreo); // uso general
router.get('/verificar-correo/:correo', usuarioController.verificarCorreo);
router.get('/verificar-rut/:rut', usuarioController.verificarRut);

// 📄 Obtener perfil completo del propio usuario (para edición u opciones privadas)
router.get('/perfil/:id', usuarioController.obtenerPerfil);

// 🌐 Obtener perfil público visible por otros usuarios
router.get('/perfil-publico/:id', usuarioController.obtenerPerfilPublico);

// ✏️ Actualizar información del perfil del usuario
router.put('/:id', usuarioController.actualizarPerfil);

// 📸 Subir imagen de perfil
const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento con multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/perfiles');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `perfil_${Date.now()}${ext}`);
  }
});

// ✅ Validación por tipo MIME real
const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Máx 5MB
  fileFilter: (req, file, cb) => {
    if (tiposPermitidos.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Solo se permiten imágenes JPEG, PNG o WEBP'));
  }
});

// Ruta para subir imagen de perfil
router.put(
  '/subir-imagen/:id',
  upload.single('imagen'),
  validarImagen,
  usuarioController.subirImagenPerfil
);

module.exports = router;
