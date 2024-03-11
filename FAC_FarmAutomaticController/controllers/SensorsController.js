import React, { Component } from 'react';
import { View, Text } from 'react-native';
const sql = require('mssql');

class DatabaseConfig {
    constructor(user, password, server, database) {
        this.user = user;
        this.password = password;
        this.server = server || 'localhost';
        this.database = database;
    }
}

class TemperatureAndHumidityQuerry {


    constructor(user,
        password,
        server,
        database) {
        user = this.user,
            password = this.password,
            server = this.server || 'localhost',
            database = this.database
    }

}


// Configuration for your MSSQL server
const config = {

};

const getTempAndHumid = new TemperatureAndHumidityQuerry(config);

export default TemperatureAndHumidityQuerry;