var Connection = require("tedious").Connection;
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;  
var config = {
  server: "NVTVNKCNTT2016\\SQLEXPRESS01",
  authentication: {
    type: "default",
    options: {
      userName: "sa",
      password: "#FlyBugClub@hoasen.edu.vn",
    },
  },
  options: {
    encrypt: true,
    database: "FAC_DB",
  },
};
var connection = new Connection(config);
connection.on("connect", function (err) {
  console.log("Connected");
});

const SELECT = (select, table, condition) => {
  var request = new Request(
    `SELECT * FROM Users;`,
    function (err) {
      if (err) {
        console.log("haha",err);
      }
    }
  );
  var result = "";
  request.on("row", function (columns) {
    columns.forEach(function (column) {
      if (column.value === null) {
        console.log("NULL");
      } else {
        result += column.value + " ";
      }
    });
    console.log(result);
    result = "";
  });

  console.log("x");
  // Close the connection after the final event emitted by the request, after the callback passes
  request.on("requestCompleted", function (rowCount, more) {
    connection.close();
  });
  connection.execSql(request);
};

module.exports = { connection, SELECT };
