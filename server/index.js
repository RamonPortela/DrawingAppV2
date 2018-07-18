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
let undo = [];
let redo = [];
let currentState = null;
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
  connectedUsers += 1;
  socket.emit('getCurrentDrawing', { image: currentState });
  // on connection call send new user online event
  // io.emit('connectionevent', connectedusers);

  // get current drawing state
  // socket.emit('getCurrentDrawing', {image: currentState});

  socket.on('disconnect', () => {
    connectedUsers -= 1;
    // on connection call send new user online event
    // io.emit('connectionevent', connectedusers);
  });

  socket.on('getCurrentDrawing', () => {
    socket.emit('getCurrentDrawing', { image: currentState });
  });

  socket.on('draw', (data) => {
    io.emit('draw', data);
  });

  socket.on('flood', (data) => {
    io.emit('flood', data);
  });

  socket.on('newDrawData', (drawData) => {
    if (undo.length < 5) {
      undo.push(drawData.previous);
    } else {
      undo = undo.slice(1);
      undo.push(drawData.previous);
    }
    currentState = drawData.current;
    redo = [];
  });

  socket.on('undo', () => {
    if (undo.length < 1) {
      io.emit('undo', { image: null });
      return;
    }
    io.emit('undo', { image: undo[undo.length - 1] });
    redo.push(currentState);
    currentState = undo.pop();
  });

  socket.on('redo', () => {
    if (redo.length < 1) {
      io.emit('redo', { image: null });
      return;
    }
    io.emit('redo', { image: redo[redo.length - 1] });
    undo.push(currentState);
    currentState = redo.pop();
  });

  socket.on('clear', () => {
    io.emit('clear');
  });
});
