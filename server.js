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
  // send nsData back to client. Use socket, no io since only want to go to client
  socket.emit('nsList', nsData);
});

namespaces.forEach(namespace => {
  io.of(namespace.endpoint).on('connection', nsSocket => {
    // console.log(`${nsSocket.id} has join ${namespace.endpoint}`);
    // a socket has connected to one namespace
    // send that ns group info back
    nsSocket.emit('nsRoomLoad', namespace.rooms);
    nsSocket.on('joinRoom', (roomToJoin, callback) => {
      // if user was in a previous room, remove and leave room
      const roomToLeave = Object.keys(nsSocket.rooms)[1];
      nsSocket.leave(roomToLeave);
      // Update the room client amount when the user leaves
      updateUsersInRoom(namespace, roomToLeave);
      // user joins room
      nsSocket.join(roomToJoin);
      // find and match the room user is in for this namespace
      const nsRoom = namespace.rooms.find(room => {
        return room.roomTitle === roomToJoin;
      });
      // console.log('user joined this ns room', nsRoom);
      // get room chat history and emit to client for this room upon user joining
      nsSocket.emit('historyCatchUp', nsRoom.history);
      // update number of users in room
      updateUsersInRoom(namespace, roomToJoin);
    });

    nsSocket.on('newMessageToServer', msg => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: 'Chris',
        avatar: 'https://via.placeholder.com/30'
      };
      // Send message to all sockets that are in the room that this socket is in

      // console.log(nsSocket.rooms);

      // the user will be in the 2nd room in the object list
      // because socket always joins its own room on connection
      // get object keys
      const roomTitle = Object.keys(nsSocket.rooms)[1];
      const nsRoom = namespace.rooms.find(room => {
        return room.roomTitle === roomTitle;
      });
      // console.log('room object that matches this NS room is', nsRoom);
      nsRoom.addMessage(fullMsg);
      io.of(namespace.endpoint)
        .to(roomTitle)
        .emit('messageToClients', fullMsg);
    });
  });
});

function updateUsersInRoom(namespace, roomToJoin) {
  io.of(namespace.endpoint)
    .in(roomToJoin)
    .clients((error, clients) => {
      // console.log(`${clients.length} in this room ${roomToJoin}`);
      io.of(namespace.endpoint)
        .in(roomToJoin)
        .emit('updateMembers', clients.length);
    });
}
