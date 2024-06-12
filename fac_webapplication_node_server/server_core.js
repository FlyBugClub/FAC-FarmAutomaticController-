const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const auth = require('./routes/auth/auth');

const db = require('./models/mysql');

db.connection();

// connectToDatabase();

const host = ['http://172.31.8.230:3000']


app.use(cors({
  origin: host,
  credentials: true,
  optionsSuccessStatus: 200,

}));
app.use(bodyParser.json());

app.use('/auth', auth);


app.listen((process.env.PORT || 3001), () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT || 3001}`);
});
