require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const http = require('http');
const { initSocket } = require('./socket');

const app = express();

// 🌐 Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🖼️ Archivos estáticos (como imágenes subidas)
app.use('/uploads', express.static('uploads'));

// 🔌 Rutas API
app.use('/api/usuario', require('./routes/usuario.routes'));     // Singular
app.use('/api/productos', require('./routes/producto.routes'));
app.use('/api/mensajes', require('./routes/mensaje.routes'));

// 🔎 Ruta raíz de prueba
app.get('/', (req, res) => {
  res.send('Servidor backend Ropero UNACH funcionando ✅');
});

// 🚀 Crear servidor HTTP + WebSocket
const server = http.createServer(app);
initSocket(server); // Socket.IO, si ya lo tienes configurado

// 🟢 Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
