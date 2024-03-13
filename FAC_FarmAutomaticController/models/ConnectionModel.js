const sql = require('mssql/msnodesqlv8');

class Connection {
    constructor(serverName = 'localhost\\SQLEXPRESS', user_ID = 'sa', password = '1', databaseName) {
        this.serverName = serverName;
        this.user_ID = user_ID;
        this.password = password;
        this.databaseName = databaseName;
        this.connectionString = `Server=${serverName};Database=${databaseName};User Id=${user_ID};Password=${password};Trusted_Connection=False;`
    }

    constructor(connectionString) {
        this.connectionString = connectionString;
    }
    get connectionString() {
        return this.connectionString;
    }
    set connectionString(connectionString) {
        this.connectionString = connectionString;
    }

    // Getter và setter cho userName
    get userName() {
        return this.userName;
    }
    set userName(userName) {
        this.userName = userName;
    }

    // Getter và setter cho password
    get password() {
        return this.password;
    }
    set password(password) {
        this.password = password;
    }

    // Getter và setter cho server
    get server() {
        return this.server;
    }
    set server(server) {
        this.server = server;
    }

    // Getter và setter cho databaseName
    get databaseName() {
        return this.databaseName;
    }
    set databaseName(databaseName) {
        this.databaseName = databaseName;
    }

    async connectToDatabase() {
        try {
            console.log("Connecting ....");
            // make sure that any items are correctly URL encoded in the connection string
            await sql.connect(connectionString);
            console.log("Connect successful");
            const result = await sql.query`select * from dbo.devices`;
            console.log(result);
        } catch (err) {
            // ... error checks
            console.error('Error:', err);
        }
    }

}

