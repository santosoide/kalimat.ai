import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import open from 'open';
import favicon from 'serve-favicon';
import socket from 'socket.io';
import { Server } from 'http';
import bodyParser from 'body-parser';
import fs from 'fs';
import mongoose from 'mongoose';
import Message from '../db/messageSchema';
import Room from '../db/roomSchema';
import { Binary } from 'mongodb';
import serveStatic from 'serve-static';
import colors from 'colors';

const port = 5000;
const app = express();
const server = Server(app);
const compiler = webpack(config);
const io = socket(server);

let room = 'kalimat.ai';

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/messages', (req, res) => {
  Message.find({ room: room, user: req.params.user }, (err, docs) => {
    res.json(docs);
  });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.get('/broadcast', function (req, res) {
  res.send(['broadcast']);
  io.to(room).emit('chat message', JSON.stringify({ type: 'text', message: "hello broadcast", user: 'bot', items: [] }));
});

io.on('connection', function (socket) {
  let socketId = socket.id;
  socket.on('subscribe', (data) => {
    console.log(`${data.user}: is connected`.green);
    socket.join(room);
  });
  socket.on('unsubscribe', (data) => {
    console.log(`${data.user}: is disconnected`.red);
  });
  socket.on('button click', (data) => {
    replay(data, socketId);
  });

  socket.on('disconnect', (data) => {
    // console.log(`${data.user}: is disconnected`.red);
  });
  socket.on('chat message', function (msg) {
    msg.type = 'text';
    console.log(`${msg.user}: is writing '${msg.message}'`.green);
    let message = new Message({ user: msg.user, type: 'text', content: msg.message, room: room, items: [] });
    message.save((err) => {
      if (err) return err;
    });

    io.to(room).emit('chat message', JSON.stringify(msg));

    replay(msg, socketId);
  });

});

function replay(msg, id) {
  let replay;
  if (isMatch(msg.message, 'hello')) {
    replay = { user: 'bot', type: 'text', message: 'got hello', room: room, items: [] };
  } else if (isMatch(msg.message, 'button')) {
    replay = { user: 'bot', type: 'template', message: 'button', room: room, items: [{ item: 'button', text: 'Ok' }, { item: 'button', text: 'No' }] };
  } else if (isMatch(msg.message, 'good')) {
    replay = { user: 'bot', type: 'text', message: 'Good!', room: room, items: [] };
  } else if (isMatch(msg.message, 'no')) {
    replay = { user: 'bot', type: 'text', message: 'Oh No!', room: room, items: [] };
  } else {
    replay = { user: 'bot', type: 'text', message: 'saya tidak mengerti', room: room, items: [] };
  }

  io.to(id).emit('chat message', JSON.stringify(replay));
}

function isMatch(str, match) {
  if (str.match(match)) {
    return true;
  } else {
    return false;
  }

}

mongoose.connect('mongodb://localhost/kalimatai');
const db = mongoose.connection;

db.once('open', () => {
  server.listen(port, function (err) {
    if (err) {
      console.log(err);
    } else {
      open(`http://localhost:${port}`);
    }
  });

  app.post('/messages', (req, res) => {
    console.log(req.body);
    let message = new Message({ user: req.body.user, type: 'text', content: req.body.message, room: room, items: [] });
    message.save((err) => {
      if (err) return err;
    });
    res.json(req.body);
  });

});
