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
      // Add listener for when user clicks on a namespace and join the namespace
      const nsEndpoint = elem.getAttribute('ns');
      joinNs(nsEndpoint);
    });
  });
  joinNs('/wiki');
});
