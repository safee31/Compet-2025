// socket-handlers.js

// const { redisClient } = require("./redis");

const setupSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("🔵 New WebSocket connection:", socket.id);

    // Event to join a task-specific room for targeted messaging
    socket.on("join-task-room", ({ taskId, userId }) => {
      if (!taskId || !userId) {
        return socket.emit("error", {
          message: "TaskId and userId are required",
        });
      }

      const roomId = `${userId}-${taskId}`;
      socket.join(roomId);
      console.log(`User ${userId} joined room for task ${taskId}`);
      socket.emit("room-joined", { roomId });
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

module.exports = setupSocketHandlers;
