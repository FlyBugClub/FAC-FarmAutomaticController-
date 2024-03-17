sql = require('mssql/msnodesqlv8')

class Database {
    constructor(user, password, server, database, instanceName) {
        this.user = user;
        this.password = password;
        this.server = server;
        this.database = database;
        this.options = {
            instanceName: instanceName
        };
        this.connection
    }
    async connectionString() {
        this.connection = sql.connect(`Server=${this.server}\\${this.options.instanceName};Database=${this.database};User Id=${this.user};Password=${this.password};Trusted_Connection=False;`);
        return this.connecttion
    }
    async disconnectFromDB() {
        if (this.connection) {
            await this.connection.close();
        }
    }

}

module.exports = Database;