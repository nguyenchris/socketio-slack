function joinRoom(roomName) {
  // send this roomName to the server
  nsSocket.emit('joinRoom', roomName, newNumberOfMembers => {
    // update the room member total now that we joined
    document.querySelector(
      '.curr-room-num-users'
    ).innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`;
  });

  nsSocket.on('historyCatchUp', history => {
    // console.log(history);
    const messagesUl = document.querySelector('#messages');
    messagesUl.innerHTML = '';
    history.forEach(msg => {
      const newMsg = buildHTML(msg);
      const currentMessages = messagesUl.innerHTML;
      messagesUl.innerHTML = currentMessages + newMsg;
    });
    messagesUl.scrollTo(0, messagesUl.scrollHeight);
  });

  nsSocket.on('updateMembers', numMembers => {
    document.querySelector(
      '.curr-room-num-users'
    ).innerHTML = `${numMembers} <span class="glyphicon glyphicon-user"></span>`;
    document.querySelector('.curr-room-text').innerText = `${roomName}`;
  });
}
