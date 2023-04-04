var client = null;

function connect() {
  var host = "192.168.20.29";
  var port = 1883;
  var clientId = "clientId-" + new Date().getTime();
  client = new Paho.MQTT.Client(host, port, clientId);
  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
  // connect the client
  client.connect({onSuccess:onConnect});
  console.log("Conectado a MQTT");

}

function disconnect() {
  if (client !== null) {
    client.disconnect();
    console.log("Disconnected");
  }
}

// called when the client connects
function onConnect() {
  console.log("Connected");
  // subscribe to a topic
  client.subscribe("mqtt");
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log("onMessageArrived:" + message.payloadString);
}
