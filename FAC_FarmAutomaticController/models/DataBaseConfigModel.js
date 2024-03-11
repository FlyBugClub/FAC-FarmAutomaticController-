class DatabaseConfig {
    constructor(user, password, server, database) {
        this.user = user;
        this.password = password;
        this.server = server || 'localhost';
        this.database = database;
    }
    
    function createDbConfig(params) {

}
} 