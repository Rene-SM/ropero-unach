const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');
const db = require('../config/db');

// Registro de usuario
exports.registrar = (req, res) => {
  console.log('🟢 Entró a controller.registrar');

  const {
    nombre,
    apellidos,
    rut,
    celular,
    fecha_nacimiento,
    tipo,
    correo,
    contraseña
  } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  Usuario.buscarPorCorreo(correo, (err, resultado) => {
    if (err) {
      console.error('❌ Error al buscar correo:', err.sqlMessage || err.message);
      return res.status(500).json({ error: 'Error interno al verificar el correo' });
    }

    if (resultado.length > 0) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    const contraseñaHash = bcrypt.hashSync(contraseña, 10);

    const nuevoUsuario = {
      nombre,
      apellidos,
      rut,
      celular,
      fecha_nacimiento,
      tipo,
      correo,
      contraseña: contraseñaHash
    };

    Usuario.crear(nuevoUsuario, (err, result) => {
      if (err) {
        console.error('❌ Error al registrar usuario:', err.sqlMessage || err.message);
        return res.status(500).json({ error: 'Error al registrar usuario' });
      }

      res.status(201).json({ mensaje: 'Usuario registrado con éxito', id: result.insertId });
    });
  });
};

// Inicio de sesión
exports.login = (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ error: 'Correo y contraseña obligatorios' });
  }

  Usuario.buscarPorCorreo(correo, (err, resultado) => {
    if (err) {
      console.error('❌ Error al buscar usuario:', err.sqlMessage || err.message);
      return res.status(500).json({ error: 'Error interno al buscar usuario' });
    }

    if (resultado.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const usuario = resultado[0];
    const contraseñaValida = bcrypt.compareSync(contraseña, usuario.contraseña);

    if (!contraseñaValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, nombre: usuario.nombre, tipo: usuario.tipo },
      process.env.JWT_SECRET || 'secreto_super_seguro',
      { expiresIn: '2h' }
    );

    // ✅ Modificación: enviar usuario con campos específicos, incluyendo tipo
    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        tipo: usuario.tipo
      }
    });
  });
};

// Verificar si el correo ya está registrado
exports.verificarCorreo = (req, res) => {
  const correo = req.params.correo;

  if (!correo) {
    return res.status(400).json({ error: 'Correo requerido' });
  }

  Usuario.buscarPorCorreo(correo, (err, resultado) => {
    if (err) {
      console.error('❌ Error al verificar correo:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    const existe = resultado.length > 0;
    res.json(existe);
  });
};

// 📄 Obtener perfil de usuario
exports.obtenerPerfil = async (req, res) => {
  const userId = req.params.id;

  const sqlUsuario = `
    SELECT id_usuario, nombre, apellidos, correo, rut, celular, tipo, fecha_registro
    FROM Usuario
    WHERE id_usuario = ?
  `;

  const sqlCalificaciones = `
    SELECT tipo_calificacion, puntuacion, comentario, fecha
    FROM Calificaciones
    WHERE id_receptor = ?
    ORDER BY fecha DESC
  `;

  try {
    const [usuario] = await db.query(sqlUsuario, [userId]);
    const [calificaciones] = await db.query(sqlCalificaciones, [userId]);

    if (usuario.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const promedio = calificaciones.length
      ? (calificaciones.reduce((acc, cal) => acc + cal.puntuacion, 0) / calificaciones.length).toFixed(1)
      : null;

    res.json({
      usuario: usuario[0],
      calificaciones,
      promedio_calificacion: promedio
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ mensaje: 'Error al obtener perfil del usuario' });
  }
};

// ✏️ Actualizar perfil del usuario
exports.actualizarPerfil = async (req, res) => {
  const id = req.params.id;
  const { nombre, correo, celular } = req.body;

  const sql = `
    UPDATE Usuario
    SET nombre = ?, correo = ?, celular = ?
    WHERE id_usuario = ?
  `;

  try {
    await db.query(sql, [nombre, correo, celular, id]);
    res.json({ mensaje: 'Perfil actualizado correctamente ✅' });
  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error.message);
    res.status(500).json({ error: 'Error al actualizar perfil del usuario' });
  }
};
