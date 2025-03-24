const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// ✅ Enable CORS for Salesforce & WebRTC Clients
app.use(cors({
    origin: [
        "https://your-salesforce-instance.lightning.force.com",  // 🔹 Replace with your Salesforce domain
        "https://meetingtool-production.up.railway.app" // 🔹 Your WebRTC signaling server
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));

// ✅ Initialize Socket.IO with CORS
const io = new Server(server, {
    cors: {
        origin: [
            "orgfarm-e5d6b7ce9a-dev-ed.develop.my.salesforce.com", 
            "https://meetingtool-production.up.railway.app"
        ],
        methods: ["GET", "POST"],
        credentials: true
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
