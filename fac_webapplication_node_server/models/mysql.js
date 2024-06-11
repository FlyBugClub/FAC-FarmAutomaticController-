const sql = require("mssql");
const sqlConfig = {
  user: "sa",
  password: "#FlyBugClub@hoasen.edu.vn",
  database: "FAC_DB",
  server: "10.101.172.53\\SQLEXPRESS01",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

const connection = async () => {
  try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(sqlConfig).then(function (result, err) {
      if (err == undefined) {
        console.log("connected");
      } else {
        console.log("connection failed");
      }
    });
  } catch (err) {
    console.log("connection failed");
  }
};

const SELECT = async (select, table, condition) => {
  return new Promise(async (resolve, reject) => {
    let condition_ = "";
    if (condition) {
      condition_ = condition;
    } else {
      condition_ = "";
    }

    const result = await sql.query(
      "select " + select + " from " + table + " " + condition_ + ""
    );

    resolve(result);
  });
};
const UPDATE = async (table_name, update_values, condition) => {
  return new Promise(async (resolve, reject) => {
    let condition_ = "";
    if (condition) {
      condition_ = condition;
    } else {
      condition_ = "";
    }

    const result = await sql.query(
      `update ${table_name} set ${update_values} ${condition_}`
    );

    resolve(result);
  });
};

const EDIT = async (table_name, update_values, condition) => {
  let condition_ = "";
  if (condition) {
    condition_ = condition;
  }

  const result = await sql.query(
    `update ${table_name} set ${update_values} ${condition_}`
  );

  return result;
};

const DELETE = async (table_name, condition) => {
  let condition_ = "";
  if (condition) {
    condition_ = condition;
  }

  const result = await sql.query(
    `delete from ${table_name} where ${condition_}`
  );

  return result;
};

module.exports = { connection, SELECT };
