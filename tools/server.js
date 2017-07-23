import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import open from 'open';
import favicon from 'serve-favicon';
import socket from 'socket.io'
import { Server } from 'http'
import bodyParser from 'body-parser'
import fs from 'fs'
import mongoose from 'mongoose'
import Message from '../db/messageSchema'
import Room from '../db/roomSchema'
import { Binary } from 'mongodb'
import serveStatic from 'serve-static'
import imageDecoder from './imageDecoder'
import colors from 'colors';
// import Image from '../db/imageSchema'
/* eslint-disable no-console */


const port = 5000;
const app = express();
const server = Server(app)
const compiler = webpack(config);
const io = socket(server)
const staticPath = path.join(__dirname, '..', '/public')

let room = 'kalimat.ai';

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(serveStatic(staticPath))

app.get('/messages', (req, res) => {
  console.log('user message =>', req.params.user);
  Message.find({ room: room, user: req.params.user }, (err, docs) => {
    res.json(docs);
  })
})

app.get('/', function (req, res) {
  console.log('get route caught this')
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.get('/broadcast', function (req, res) {
  res.send(['broadcast']);
  io.to(room).emit('chat message', JSON.stringify({ message: "hello broadcast", user: 'bot' }));
});

io.on('connection', function (socket) {
  socket.on('subscribe', (data) => {
    console.log(`${data.user}: is connected`.green);
    socket.join(room)
  })
  socket.on('unsubscribe', (data) => {
    console.log(`${data.user}: is disconnected`.red);
  })

  socket.on('disconnect', (data) => {
    // console.log(`${data.user}: is disconnected`.red);
  })

  socket.on('chat message', function (msg) {
    console.log(`${msg.user}: is writing '${msg.message}'`.green)
    let message = new Message({ user: msg.user, content: msg.message, room: room })
    message.save((err) => {
      if (err) return err
    })

    io.to(room).emit('chat message', JSON.stringify(msg))
  });

});

mongoose.connect('mongodb://localhost/kalimatai')
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
    console.log(req.body)
    let message = new Message({ user: req.body.user, content: req.body.message, room: room })
    message.save((err) => {
      if (err) return err
    })
    res.json(req.body)
  })

})

