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

module.exports = router;
