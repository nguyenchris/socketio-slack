const socket = io('http://localhost:3000');
let nsSocket = '';
socket.on('nsList', nsData => {
  console.log('List of namespaces has arrived');
  // console.log(nsData);
  let namespacesDiv = document.querySelector('.namespaces');
  namespacesDiv.innerHTML = '';
  nsData.forEach(ns => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${
      ns.img
    }" /></div>`;
  });

  // add clickListner to each NS
  Array.from(document.getElementsByClassName('namespace')).forEach(elem => {
    elem.addEventListener('click', e => {
      const nsEndpoint = elem.getAttribute('ns');
    });
  });
  joinNs('/wiki');
});

// socket.on('messageFromServer', dataFromServer => {
//   console.log(dataFromServer);
//   socket.emit('dataToServer', { data: 'Data from the Client!' });
// });
