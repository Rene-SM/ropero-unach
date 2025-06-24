const mysql = require('mysql2/promise');
require('dotenv').config();

// 🔌 Crear pool de conexiones MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 🔍 Probar conexión al iniciar
(async () => {
  try {
    const conn = await db.getConnection();
    console.log('✅ Conexión exitosa a la base de datos MySQL');
    conn.release();
  } catch (err) {
    console.error('❌ Error al conectar a MySQL:', err.message);
  }
})();

module.exports = db;
