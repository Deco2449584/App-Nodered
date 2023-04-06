// Crea una instancia de WebSocket que se conecta al servidor Node-RED, esta conexion esta disponible desde nodejs
const socket = new WebSocket('ws://192.168.20.29:1880/ws/example');
//La función setAttributeToElement toma tres argumentos: element, attribute y value. Esta función se utiliza para agregar un atributo y su valor a un elemento HTML.
function setAttributeToElement(element, attribute, value) {
  element.setAttribute(attribute, value);
}
// Llamando a la función para agregar el atributo data-id a los botones
const button1 = document.getElementById('button1');
setAttributeToElement(button1, 'data-id', 'button1');
const button2 = document.getElementById('button2');
setAttributeToElement(button2, 'data-id', 'button2');
const button3 = document.getElementById('button3');
setAttributeToElement(button3, 'data-id', 'button3');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Función para cargar los estados guardados de localStorage
function loadButtonStates() {
  document.querySelectorAll('.button').forEach(button => {
    const id = button.getAttribute('data-id');
    const state = localStorage.getItem(`button-${id}`);
    if (state === "on") {
      button.classList.remove('off');
      button.classList.add('on');
    } else if (state === "off") {
      button.classList.remove('on');
      button.classList.add('off');
    }
  });
}

// Agregar un evento de escucha para la carga de la página
window.addEventListener('load', () => {
  loadButtonStates();
});

// Agregar un evento de click a todos los botones
document.querySelectorAll('.button').forEach(button => {
  button.addEventListener('click', () => {
    const id = button.getAttribute('data-id'); // Obtener el id del botón presionado
    if (button.classList.contains('on')) {
      button.classList.remove('on');
      button.classList.add('off');
      sendCommand(id, "off"); // Enviar el estado "off" del botón al servidor
      localStorage.setItem(`button-${id}`, "off"); // Guardar el estado "off" del botón en localStorage
    } else {
      button.classList.remove('off');
      button.classList.add('on');
      sendCommand(id, "on"); // Enviar el estado "on" del botón al servidor
      localStorage.setItem(`button-${id}`, "on"); // Guardar el estado "on" del botón en localStorage
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

// Función para actualizar el estado de los botones y guardar el estado en localStorage
function updateButtonState(command) {
  const id = command.id;
  const state = command.state;
  const button = document.querySelector(`[data-id="${id}"]`); // Buscar el botón por su id

  if (button) {
    if (state === "on") {
      button.classList.remove('off');
      button.classList.add('on');
      localStorage.setItem(`button-${id}`, "on"); // Guardar el estado "on" del botón en localStorage
    } else {
      button.classList.remove('on');
      button.classList.add('off');
      localStorage.setItem(`button-${id}`, "off"); // Guardar el estado "off" del botón en localStorage
    }
  }
}

// Agregar un evento de mensaje para recibir comandos del servidor
socket.addEventListener('message', event => {
  const command = JSON.parse(event.data);
  updateButtonState(command);
});
