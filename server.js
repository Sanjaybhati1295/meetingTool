const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Server } = require("socket.io"); // Import the Server class from socket.io
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get("/", (req, res) => {
    res.send("WebRTC Signaling Server is running!");
  });


io = new Server(server, {
    cors: {
        origin: ["orgfarm-e5d6b7ce9a-dev-ed.develop.my.salesforce.com"], // Replace with your Salesforce URL
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
});
  
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        socket.to(roomId).emit('user-joined', socket.id);
    });

    socket.on('offer', (data) => {
        socket.to(data.roomId).emit('receive-offer', data);
    });

    socket.on('answer', (data) => {
        socket.to(data.roomId).emit('receive-answer', data);
    });

    socket.on('ice-candidate', (data) => {
        socket.to(data.roomId).emit('receive-ice-candidate', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3000, () => console.log('Signaling server running on port 3000'));
