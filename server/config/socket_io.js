// services/socketService.js
const socketIo = require("socket.io");
let io = null;

module.exports = {
  initIO: (httpServer) => {
    io = socketIo(httpServer, {
      cors: {
        origin: "*",
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
