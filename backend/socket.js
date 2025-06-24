let io;

function initSocket(server) {
  io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('🟢 Cliente conectado');

    socket.on('mensajeEnviado', (mensaje) => {
      io.emit('mensajeNuevo', mensaje);
    });

    socket.on('disconnect', () => {
      console.log('🔴 Cliente desconectado');
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io no inicializado');
  }
  return io;
}

module.exports = { initSocket, getIO };
