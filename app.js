const express = require('express');
const app = express();

// Sirve la carpeta 'public' como recurso estático
app.use(express.static('public'));

// Maneja todas las solicitudes GET enviadas a la raíz del servidor
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// Inicia el servidor en el puerto 3000
app.listen(3000, function() {
  console.log('Servidor iniciado en el puerto 3000');
});
