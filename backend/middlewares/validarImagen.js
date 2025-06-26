const path = require('path');

const validarImagen = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ mensaje: 'No se subió ninguna imagen' });
  }

  const ext = path.extname(req.file.originalname).toLowerCase();

  const extensionesValidas = ['.jpg', '.jpeg', '.png', '.webp'];

  if (!extensionesValidas.includes(ext)) {
    return res.status(400).json({ 
      mensaje: 'Formato de imagen no permitido. Solo se permiten .jpg, .jpeg, .png, .webp' 
    });
  }

  next();
};

module.exports = validarImagen;
