const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const auth = require('./routes/auth/auth');
const data = require('./routes/data/data');
const db = require('./models/mysql');
const mqtt = require('mqtt');
// Connect to MySQL database
db.connection();
// Allowed CORS origins
const host = [
  'http://172.31.8.230:3000',
  'http://10.101.172.53:3000',
  "http://10.101.172.53:8080",
  "http://10.101.172.53:8080",
  "http://192.168.0.105:3000", //wifi thutam
  "http://172.31.8.227:3000",
  'http://172.16.17.47:3000',
  "http://192.168.1.194:3000",
  "http://192.168.1.9:3000"
];

// Middleware Configuration
app.use(cors({
  origin: host,
  credentials: true,
  optionsSuccessStatus: 200,
}));
app.use(bodyParser.json());

// Routes
app.use('/auth', auth);
app.use('/data', data);

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// MQTT Client Configuration
// MQTT Broker Configuration
const brokerUrl = 'mqtt://broker.emqx.io';
const brokerPort = 1883;

// Create a client instance
const mqttClient = mqtt.connect(`${brokerUrl}:${brokerPort}`);
module.exports.mqttClient = mqttClient; // Export MQTT client để sử dụng trong các file khác



mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  const topic = 'sensorData';
  mqttClient.subscribe(topic, (err) => {
    if (!err) {
      console.log(`Subscribed to topic '${topic}'`);
    } else {
      console.error('Failed to subscribe:', err);
    }
  });
});

mqttClient.on('message', async (topic, message) => {
  console.log(`Received message from topic '${topic}': ${message}`); 
  let parsedMessage = JSON.parse(message);
  console.log(parsedMessage.id_esp);// TODO xử lý message và đưa vào body rồi add dữ liệu cảm biến vào 
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.executeProcedure("dbo.add_farm_pro", body);
      resolve({ status: true});
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
});

mqttClient.on('error', (err) => {
  console.error('MQTT client error:', err);
});
