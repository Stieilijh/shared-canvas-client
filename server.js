const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

let drawingHistory = []; // Store all drawn lines

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send existing drawings to the new user
  socket.emit('load-drawing', drawingHistory);

  socket.on('drawing', (data) => {
    drawingHistory.push(data); // Store the drawing data
    socket.broadcast.emit('drawing', data);
  });

  socket.on('clear-canvas', () => {
    drawingHistory = []; // Clear history
    io.emit('clear-canvas'); // Broadcast to all users
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
