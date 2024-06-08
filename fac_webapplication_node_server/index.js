const express = require("express");
const app = express();
const port = 3000;
//
const bodyParser = require("body-parser");
app.use(bodyParser.json());
//
//
// Import the API routes
const apiRoutes = require('./src/routes/api');
//
const { connectToDatabase, queryDatabase } = require('./src/db');
connectToDatabase();
// Use the API routes
app.use('/api', apiRoutes);
//


app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
