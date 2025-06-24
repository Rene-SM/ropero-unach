const path = require('path');
const ProductoModel = require('../models/producto.model');
const db = require('../config/db');

const ProductoController = {
  // Crear producto
  crearProducto: async (req, res) => {
    try {
      const {
        id_usuario,
        id_categoria,
        id_tipo_donacion,
        nombre,
        descripcion,
        estado,
        talla,
        tipo_operacion,
        precio,
        cantidad
      } = req.body;

      if (!id_usuario || !id_categoria || !nombre || !estado || !tipo_operacion) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
      }

      const id_producto = await ProductoModel.crearProducto({
        id_usuario: Number(id_usuario),
        id_categoria: Number(id_categoria),
        id_tipo_donacion: tipo_operacion === 'donar' ? Number(id_tipo_donacion) : null,
        nombre,
        descripcion: descripcion || null,
        estado,
        talla: talla || null,
        tipo_operacion,
        precio: precio ? parseFloat(precio) : 0,
        cantidad: cantidad ? Number(cantidad) : 1
      });

      if (Array.isArray(req.files) && req.files.length) {
        const rutas = req.files.map(f => path.join('uploads', f.filename));
        await ProductoModel.agregarImagenes(id_producto, rutas);
      }

      return res.status(201).json({
        mensaje: 'Producto publicado correctamente',
        id_producto
      });
    } catch (error) {
      console.error('❌ Error al crear producto:', error);
      return res.status(500).json({ mensaje: 'Error al publicar producto' });
    }
  },

  // Listar todos los productos
  obtenerProductos: async (_req, res) => {
    try {
      const productos = await ProductoModel.obtenerTodos();
      return res.status(200).json(productos);
    } catch (error) {
      console.error('❌ Error al obtener productos:', error);
      return res.status(500).json({ mensaje: 'Error al obtener productos' });
    }
  },

  // Obtener producto por ID con todas sus imágenes
  obtenerProductoPorId: async (req, res) => {
    try {
      const id = req.params.id;

      const [productoRows] = await db.execute(`
        SELECT * FROM Productos WHERE id_producto = ?
      `, [id]);

      if (productoRows.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      const producto = productoRows[0];

      const [imagenesRows] = await db.execute(`
        SELECT url_imagen FROM Imagenes WHERE id_producto = ?
      `, [id]);

      const imagenes = imagenesRows.map(img => img.url_imagen);
      producto.imagenes = imagenes;

      res.json(producto);
    } catch (error) {
      console.error('❌ Error al obtener producto por ID:', error);
      res.status(500).json({ mensaje: 'Error al obtener producto' });
    }
  },

  // Obtener productos de categoría Ropa
  obtenerRopaGeneral: async (_req, res) => {
    try {
      const sql = `
        SELECT p.*, MIN(i.url_imagen) AS imagen, cg.nombre AS tipo_categoria, s.nombre AS subcategoria
        FROM Productos p
        LEFT JOIN Imagenes i ON p.id_producto = i.id_producto
        JOIN Categorias c ON p.id_categoria = c.id_categoria
        JOIN CategoriasGenerales cg ON c.id_categoria_general = cg.id_categoria_general
        JOIN Subcategorias s ON c.id_subcategoria = s.id_subcategoria
        WHERE cg.nombre LIKE 'Ropa%'
        GROUP BY p.id_producto
        ORDER BY p.fecha_publicacion DESC
      `;

      const [rows] = await db.execute(sql);
      res.json(rows);
    } catch (error) {
      console.error('❌ Error al obtener ropa general:', error);
      res.status(500).json({ error: 'Error al obtener ropa general' });
    }
  },

  // Obtener productos de categoría Accesorios
  obtenerAccesorios: async (_req, res) => {
    try {
      const sql = `
        SELECT p.*, MIN(i.url_imagen) AS imagen, cg.nombre AS tipo_categoria, s.nombre AS subcategoria
        FROM Productos p
        LEFT JOIN Imagenes i ON p.id_producto = i.id_producto
        JOIN Categorias c ON p.id_categoria = c.id_categoria
        JOIN CategoriasGenerales cg ON c.id_categoria_general = cg.id_categoria_general
        JOIN Subcategorias s ON c.id_subcategoria = s.id_subcategoria
        WHERE cg.nombre = 'Accesorios'
        GROUP BY p.id_producto
        ORDER BY p.fecha_publicacion DESC
      `;

      const [rows] = await db.execute(sql);
      res.json(rows);
    } catch (error) {
      console.error('❌ Error al obtener accesorios:', error);
      res.status(500).json({ error: 'Error al obtener accesorios' });
    }
  },

  // Obtener productos donados a la comunidad
  obtenerDonacionesComunidad: async (_req, res) => {
    try {
      const sql = `
        SELECT p.*, MIN(i.url_imagen) AS imagen,
               cg.nombre AS tipo_categoria,
               s.nombre AS subcategoria,
               td.nombre AS tipo_donacion
        FROM Productos p
        LEFT JOIN Imagenes i ON p.id_producto = i.id_producto
        JOIN Categorias c ON p.id_categoria = c.id_categoria
        JOIN CategoriasGenerales cg ON c.id_categoria_general = cg.id_categoria_general
        JOIN Subcategorias s ON c.id_subcategoria = s.id_subcategoria
        JOIN TipoDonacion td ON p.id_tipo_donacion = td.id_tipo_donacion
        WHERE p.tipo_operacion = 'donar' AND td.nombre = 'Comunidad'
        GROUP BY p.id_producto
        ORDER BY p.fecha_publicacion DESC
      `;
      const [rows] = await db.execute(sql);
      res.json(rows);
    } catch (error) {
      console.error('❌ Error al obtener donaciones a la comunidad:', error);
      res.status(500).json({ error: 'Error al obtener donaciones a la comunidad' });
    }
  },

  // Obtener publicaciones por usuario con imagen
  obtenerPublicacionesPorUsuario: async (req, res) => {
    const { idUsuario } = req.params;

    try {
      const sql = `
        SELECT p.*, MIN(i.url_imagen) AS imagen_destacada
        FROM Productos p
        LEFT JOIN Imagenes i ON p.id_producto = i.id_producto
        WHERE p.id_usuario = ?
        GROUP BY p.id_producto
        ORDER BY p.fecha_publicacion DESC
      `;

      const [rows] = await db.execute(sql, [idUsuario]);

      const publicaciones = rows.map(row => ({
        ...row,
        imagenes: row.imagen_destacada
          ? [{ url: `http://localhost:3000/${row.imagen_destacada}` }]
          : []
      }));

      res.json(publicaciones);
    } catch (error) {
      console.error('❌ Error al obtener publicaciones del usuario:', error);
      res.status(500).json({ mensaje: 'Error al obtener publicaciones del usuario' });
    }
  },

  // ✅ Eliminar producto y registrar moderación
  eliminarProducto: async (req, res) => {
    const { id } = req.params;
    const idAdmin = req.headers['idadmin'];

    if (!idAdmin) {
      return res.status(401).json({ mensaje: 'No se especificó el ID del administrador' });
    }

    try {
      const [[producto]] = await db.execute(`
        SELECT id_usuario, nombre FROM Productos WHERE id_producto = ?
      `, [id]);

      if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
      }

      const { id_usuario, nombre } = producto;

      await db.execute(`DELETE FROM Imagenes WHERE id_producto = ?`, [id]);
      await db.execute(`DELETE FROM Productos WHERE id_producto = ?`, [id]);

      await db.execute(`
        INSERT INTO Moderaciones (id_admin, id_usuario_afectado, id_producto_eliminado, nombre_producto, fecha_eliminacion)
        VALUES (?, ?, ?, ?, NOW())
      `, [idAdmin, id_usuario, id, nombre]);

      res.json({ mensaje: 'Producto eliminado y moderación registrada' });
    } catch (error) {
      console.error('❌ Error al eliminar producto:', error.message);
      res.status(500).json({ mensaje: 'Error al eliminar producto' });
    }
  },

  // ✅ Obtener historial de moderación
  obtenerHistorialModeracion: async (_req, res) => {
    try {
      const [rows] = await db.execute(`
        SELECT 
          m.id_moderacion,
          m.id_producto_eliminado,
          m.nombre_producto,
          m.fecha_eliminacion,
          u.id_usuario,
          u.nombre,
          u.apellidos
        FROM Moderaciones m
        JOIN Usuario u ON m.id_usuario_afectado = u.id_usuario
        ORDER BY m.fecha_eliminacion DESC
      `);

      const historial = rows.map(row => ({
        ...row,
        perfil_url: `/perfil-publico/${row.id_usuario}`
      }));

      res.json(historial);
    } catch (error) {
      console.error('❌ Error al obtener historial de moderación:', error.message);
      res.status(500).json({ mensaje: 'Error al obtener historial de moderación' });
    }
  }
};

module.exports = ProductoController;
