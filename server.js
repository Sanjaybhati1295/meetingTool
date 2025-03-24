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
const socket = io("wss://meetingtool-production.up.railway.app", {
    transports: ["websocket", "polling"],
});

socket.on("connect", () => {
console.log("Connected to WebSocket server:", socket.id);
});

socket.on("disconnect", () => {
console.log("Disconnected from server");
});

socket.on("user-joined", (userId) => {
console.log(`User ${userId} joined the meeting`);
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
