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
  'http://172.16.17.85:3000',
  "http://192.168.1.194:3000",
  "http://192.168.1.9:3000",
  "http://192.168.1.6:3000",
  "http://192.168.0.55:3000",
  "http://172.20.10.4:3000",
  "http://172.24.64.1:3000",
  "http://192.168.56.1:3000",
  "http://192.168.1.18:3000",
  "http://192.168.0.53:3000",
  "http://192.168.0.209:3000",
  "http://192.168.1.21:3000",
  "http://192.168.0.210:3000",
  "http://192.168.1.5:3000",
  "http://192.168.0.104:3000",
  "http://103.130.211.141:8080",

];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true); // Cho phép nguồn này
    } else {
      callback(new Error('Not allowed by CORS')); // Chặn nguồn không được phép
    }
  },
  credentials: true,  // Hỗ trợ credentials (cookie, sessions, etc.)
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
  const topic = 'FlyBug__sensorData';
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
  let parsedMessage;
  try {
    parsedMessage = JSON.parse(message);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return; // Dừng xử lý nếu JSON không hợp lệ
  }

  console.log(parsedMessage.idesp);
  console.log(parsedMessage.humid);
  console.log(parsedMessage.temp);

  // Kiểm tra xem idesp, humid và temp có phải là null hoặc undefined không
  if (!parsedMessage.idesp || 
      parsedMessage.humid === null || parsedMessage.humid === undefined || 
      parsedMessage.temp === null || parsedMessage.temp === undefined) {
    console.log("id_esp, Humidity, or Temperature data is missing. Not sending to database.");
    return; // Không gửi dữ liệu nếu có thông tin thiếu
  }

  // Chuẩn bị dữ liệu để gửi vào thủ tục
  let body = [
    parsedMessage.idesp,
    parsedMessage.humid,
    parsedMessage.temp
  ];

  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.executeProcedure("add_values_sensor_pro", body);
      resolve({ status: true });
    } catch (error) {
      console.error("Error executing procedure:", error);
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
});

mqttClient.on('error', (err) => {
  console.error('MQTT client error:', err);
});
