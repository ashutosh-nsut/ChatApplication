import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://chatapplication-frontend.onrender.com"],
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // { userId -> socketId }

// Function to get receiver's socket ID
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId] || null;
};

io.on("connection", (socket) => {
  // Get userId from query (fallback to socket.id if missing)
  const userId = socket.handshake.query.userId || socket.id;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Emit the list of online users (you may modify the emitted data as needed)
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

// Export app, io, and server
export { app, io, server };
