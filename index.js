const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join_room', (roomID, username) => {
    socket.join(roomID);
    console.log(`${username} joined the room ${roomID}`);
    io.to(roomID).emit('chat message', { message: `${username} joined the chat`, username: 'Admin' });
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      console.log(`${socket.username} left the chat`);
      io.to(socket.roomID).emit('user left', socket.username); // Emit the 'user left' event with the username
    }
  });

  socket.on('chat message', (data) => {
    const { message, username, roomID } = data;
    socket.roomID = roomID; // Store the room ID as a property of the socket
    socket.username = username; // Store the username as a property of the socket
    io.to(roomID).emit('chat message', { message: message, username: username });
  });
});




server.listen(3000, () => {
  console.log('listening on *:3000');
});

