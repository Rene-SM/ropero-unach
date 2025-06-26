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

    // Escuchar evento de unión a una sala
    socket.on('unirseConversacion', (idConversacion) => {
      socket.join(`conversacion_${idConversacion}`);
    });

    socket.on('mensajeEnviado', (mensaje) => {
      const idConversacion = mensaje.id_conversacion;
      // Emitir mensaje solo a la sala correspondiente
      io.to(`conversacion_${idConversacion}`).emit('mensajeNuevo', mensaje);
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
