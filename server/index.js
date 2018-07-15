const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
const path = require('path');
// const db = require('./db').MongoDb;
// const webpush = require('web-push');

const serverPort = process.env.PORT || 8080;
const serverIpAddress = '0.0.0.0' || '127.0.0.1';
const undo = [];
const redo = [];
const currentState = null;
let connectedUsers = 0;
const usersFocusingPage = 0;

server.listen(serverPort, serverIpAddress, () => {
  // console.log('teste');
});

const publicPath = __dirname.replace('server', 'public');

app.use(express.static(publicPath));

app.get('*', (req, res, next) => {
  if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] === 'http') {
    if (serverPort !== 8080) { res.redirect(`https://drawing-momo-v2.herokuapp.com${req.url}`); }
  }

  next();
});

app.get('/', (req, res) => {
  res.sendFile(`${publicPath}/index.html`);
});

io.on('connection', (socket) => {
  connectedUsers++;
  // on connection call send new user online event
  // io.emit('connectionevent', connectedusers);

  // get current drawing state
  // socket.emit('getCurrentDrawing', {image: currentState});

  socket.on('disconnect', () => {
    connectedUsers--;
    // on connection call send new user online event
    // io.emit('connectionevent', connectedusers);
  });

  socket.on('draw', (data) => {
    io.emit('draw', data);
  });
});
