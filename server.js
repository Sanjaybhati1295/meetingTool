const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// ✅ Initialize Socket.IO with CORS
const io = new Server(server, {
    cors: {
      origin: "*",  // Allow all origins (You can restrict to specific domains)
      methods: ["GET", "POST"]
    }
  });

// ✅ Handle WebRTC Connections
io.on("connection", (socket) => {
    console.log("🔹 User Connected:", socket.id);

    // 🎯 Handle Room Joining
    socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`🔹 User ${socket.id} joined room ${roomId}`);
        socket.to(roomId).emit("user-connected", socket.id);
    });

    // 🎯 Handle Disconnect
    socket.on("disconnect", () => {
        console.log("❌ User Disconnected:", socket.id);
    });
});

// ✅ Default Route
app.get("/", (req, res) => {
    res.send("WebRTC Signaling Server is running!");
});

// ✅ Start the Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ WebRTC Signaling Server is running on port ${PORT}`);
});
