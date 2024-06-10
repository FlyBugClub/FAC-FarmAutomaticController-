const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const data = require('./routes/data/data');
const db = require('./models/mysql');
db.connection.connect();
// connectToDatabase();

const corsOptions = {
  origin: 'http://192.168.1.39:3000',//(https://your-client-app.com)
};


app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/data', data);

app.listen((process.env.PORT || 3001), () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT || 3001}`);
});
