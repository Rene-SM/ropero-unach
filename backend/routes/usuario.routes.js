const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

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

// 🔍 Verificar si un correo ya está registrado
router.get('/verificar', usuarioController.verificarCorreo);

// 📄 Obtener perfil de un usuario por su ID (GET)
router.get('/perfil/:id', usuarioController.obtenerPerfil);

// ✏️ Actualizar información del perfil (PUT)
router.put('/:id', usuarioController.actualizarPerfil);

router.get('/verificar-correo/:correo', usuarioController.verificarCorreo);


module.exports = router;
