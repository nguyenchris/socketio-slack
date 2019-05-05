const express = require('express');
const app = express();
const socketio = require('socket.io');

let namespaces = require('./data/namespaces');
app.use(express.static(__dirname + '/public'));
const expressServer = app.listen(3000);
const io = socketio(expressServer);

io.on('connection', socket => {
  // build array to send back with img and endpoint for each namespace
  let nsData = namespaces.map(ns => {
    return {
      img: ns.img,
      endpoint: ns.endpoint
    };
  });
  // console.log(nsData);
  // send nsData back to client. Use socket, no io since only want to go to client
  socket.emit('nsList', nsData);
});

namespaces.forEach(namespace => {
  io.of(namespace.endpoint).on('connection', nsSocket => {
    console.log(`${nsSocket.id} has join ${namespace.endpoint}`);
    // a socket has connected to one namespace
    // send that ns group info back
    nsSocket.emit('nsRoomLoad', namespaces[0].rooms);
    nsSocket.on('joinRoom', (roomToJoin, callback) => {
      nsSocket.join(roomToJoin);
      io.of('/wiki')
        .in(roomToJoin)
        .clients((error, clients) => {
          console.log(clients);
          callback(clients.length);
        });
    });
    nsSocket.on('newMessageToServer', msg => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: 'Chris',
        avatar: 'https://via.placeholder.com/30'
      };
      console.log('msg', fullMsg);
      // Send message to all sockets that are in the room that this socket is in
      console.log(nsSocket.rooms);
      // the user will be in the 2nd room in the object list
      // because socket always joins its own room on connection
      // get object keys
      const roomTitle = Object.keys(nsSocket.rooms)[1];
      console.log(roomTitle);
      io.of('/wiki')
        .to(roomTitle)
        .emit('messageToClients', fullMsg);
    });
  });
});
