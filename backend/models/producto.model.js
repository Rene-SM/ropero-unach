const db = require('../config/db');  // Pool mysql2/promise

const TABLA = 'productos'; // usa siempre minúscula para evitar case-sensitivity

// Helper: ejecuta SQL y devuelve filas
const ejecutar = (sql, params = []) =>
  db.execute(sql, params).then(([rows]) => rows);

const ProductoModel = {
  // Crear producto y devolver el ID insertado
  crearProducto: async (p) => {
    const sql = `
      INSERT INTO ${TABLA}
        (id_usuario, id_categoria, id_tipo_donacion, nombre, descripcion,
         estado, talla, tipo_operacion, precio, cantidad)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      p.id_usuario,
      p.id_categoria,
      p.id_tipo_donacion || null,
      p.nombre,
      p.descripcion,
      p.estado,
      p.talla,
      p.tipo_operacion,
      p.precio,
      p.cantidad
    ];

    const [result] = await db.execute(sql, params);
    return result.insertId;
  },

  // Obtener todos los productos con sus imágenes
  obtenerTodos: async () => {
    const sql = `
      SELECT p.*,
             COALESCE(JSON_ARRAYAGG(i.url_imagen), JSON_ARRAY()) AS imagenes
      FROM ${TABLA} p
      LEFT JOIN imagenes i ON i.id_producto = p.id_producto
      GROUP BY p.id_producto
      ORDER BY p.fecha_publicacion DESC
    `;
    return ejecutar(sql);
  },

  // Insertar múltiples rutas de imágenes (bulk insert)
  agregarImagenes: async (id_producto, rutas) => {
    if (!Array.isArray(rutas) || rutas.length === 0) {
      console.warn('⚠️ No se recibieron rutas de imágenes válidas:', rutas);
      return;
    }
    const valores = rutas.map(url => [id_producto, url]);
    const sql = 'INSERT INTO imagenes (id_producto, url_imagen) VALUES ?';
    await db.query(sql, [valores]);
    console.log('✅ Imágenes insertadas:', rutas.length);
  }
};

module.exports = ProductoModel;
