function joinRoom(roomName) {
  // send this roomName to the server
  nsSocket.emit('joinRoom', roomName, newNumberOfMembers => {
    // update the room member total now that we joined
    document.querySelector(
      '.curr-room-num-users'
    ).innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`;
  });
}
