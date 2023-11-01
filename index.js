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
    const roomID = socket.roomID;
    const username = socket.username || 'A user';
    console.log(`${username} left the chat`);
    io.to(roomID).emit('user left', username);
  });

  socket.on('chat message', (data) => {
    const { message, username, roomID } = data;
    socket.roomID = roomID;
    socket.username = username;
    io.to(roomID).emit('chat message', { message: message, username: username });
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
