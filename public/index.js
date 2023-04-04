// Crea una instancia de WebSocket que se conecta al servidor Node-RED
const socket = new WebSocket('ws://192.168.40.32:1880/ws/example');

//función para agregar el atributo data-id a un botón dado su ID
function addDataIdToButton(id) {
    const button = document.getElementById(id);
    button.setAttribute('data-id', id);
  }
  
//De esta forma, cada vez que agregues un nuevo botón, simplemente llamas a esta función y le pasas el ID correspondiente
const button1 = document.getElementById('button1');
addDataIdToButton('button1');
const button2 = document.getElementById('button2');
addDataIdToButton('button2');
const button3 = document.getElementById('button3');
addDataIdToButton('button3');

// Agregar un evento de click a todos los botones
document.querySelectorAll('.button').forEach(button => {
  button.addEventListener('click', () => {
    const id = button.getAttribute('data-id'); // Obtener el id del botón presionado
    if (button.classList.contains('on')) {
      button.classList.remove('on');
      button.classList.add('off');
      sendCommand(id, "off"); // Enviar el estado "off" del botón al servidor
    } else {
      button.classList.remove('off');
      button.classList.add('on');
      sendCommand(id, "on"); // Enviar el estado "on" del botón al servidor
    }
  });
});

// Función de manejo de evento para enviar comandos al servidor
function sendCommand(id, state) {
  const command = {
    id: id,
    state: state
  };
  socket.send(JSON.stringify(command));
}

// Función para actualizar el estado de los botones
function updateButtonState(command) {
  const id = command.id;
  const state = command.state;
  const button = document.querySelector(`[data-id="${id}"]`); // Buscar el botón por su id

  if (button) {
    if (state === "on") {
      if (!button.classList.contains('on')) {
        button.classList.remove('off');
        button.classList.add('on');
        // Enviar el nuevo estado a través del WebSocket a todas las conexiones
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(command));
          console.log("mensaje on enviado a todos los socket")
        }
      }
    } else if (state === "off") {
      if (!button.classList.contains('off')) {
        button.classList.remove('on');
        button.classList.add('off');
        // Enviar el nuevo estado a través del WebSocket a todas las conexiones
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(command));
        }
      }
    }
  }
}


// Agregar un evento de escucha para mensajes entrantes del servidor
socket.addEventListener('message', (event) => {
  const command = JSON.parse(event.data);
  updateButtonState(command);
});
