// Import statement
const sql = require('mssql/msnodesqlv8');
const Database = require('../database');

class HumidController {
    constructor() {

    }

    async getHumid(esp_id) {
        try {
            const db = new Database('sa', '1', 'localhost', 'Test2', 'SQLEXPRESS');
            let pool = await sql.connect(db.connectionString());
            const result = await pool.request().query(`SELECT esp_id, humid FROM tbl_Humid where esp_id = '${esp_id}'`);
            return result.recordsets;
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = HumidController;
