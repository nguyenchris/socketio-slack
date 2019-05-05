function joinNs(endpoint) {
  // check nsSocket is actually socket
  if (nsSocket) {
    // close socket if exists before joining another ns
    nsSocket.close();
    // remove eventListener before it's added again
    document.querySelector('#user-input').removeEventListener('submit', formSubmission);
  }
  nsSocket = io(`http://localhost:3000${endpoint}`);
  nsSocket.on('nsRoomLoad', nsRooms => {
    // console.log(nsRooms);
    let roomList = document.querySelector('.room-list');
    roomList.innerHTML = '';
    nsRooms.forEach(room => {
      // console.log(room);
      let glyph;
      if (room.privateRoom) {
        glyph = 'lock';
      } else {
        glyph = 'globe';
      }
      roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${
        room.roomTitle
      }</li>`;
    });
    let roomNodes = document.getElementsByClassName('room');
    Array.from(roomNodes).forEach(elem => {
      elem.addEventListener('click', e => {
        joinRoom(e.target.innerText);
      });
    });
    const topRoom = document.querySelector('.room');
    const topRoomName = topRoom.innerText;
    // console.log(topRoomName);
  });

  nsSocket.on('messageToClients', msg => {
    const newMsg = buildHTML(msg);
    document.querySelector('#messages').innerHTML += `<li>${newMsg}</li>`;
  });

  document.querySelector('.message-form').addEventListener('submit', formSubmission);
}

function formSubmission(event) {
  event.preventDefault();
  const newMessage = document.querySelector('#user-message').value;
  nsSocket.emit('newMessageToServer', { text: newMessage });
}

function buildHTML(msg) {
  const convertedDate = new Date(msg.time).toLocaleString();
  const newHTML = `
      <li>
        <div class="user-image">
          <img src="https://via.placeholder.com/30" />
        </div>
        <div class="user-message">
          <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
          <div class="message-text">${msg.text}</div>
          </div>
      </li>
  `;
  return newHTML;
}
