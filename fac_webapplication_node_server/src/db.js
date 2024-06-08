// src/db.js

const sql = require('mssql');
const config = require('./dbConfig');

async function connectToDatabase() {
  try {
    await sql.connect(config);
    console.log('Connected to SQL Server');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}

async function queryDatabase(query, params = []) {
  try {
    const request = new sql.Request();
    for (const param of params) {
      request.input(param.name, param.type, param.value);
    }
    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error('Query failed:', err);
  }
}

module.exports = {
  connectToDatabase,
  queryDatabase,
};
