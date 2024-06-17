const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const auth = require('./routes/auth/auth');
const data = require('./routes/data/data');
const db = require('./models/mysql');
require('dotenv').config();

db.connection();

// connectToDatabase();

const host = [
  'http://172.31.8.230:3000',
  'http://10.101.172.53:3000',
  "http://10.101.172.53:8080",
  "http://172.16.17.47:3000"

]


app.use(cors({
  origin: host,
  credentials: true,
  optionsSuccessStatus: 200,

}));
app.use(bodyParser.json());

app.use('/auth', auth);
app.use('/data', data);

app.listen((process.env.PORT || 3001), () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT || 3001}`);
});
