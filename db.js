const SETUP = require("./setup.json");

const config = {
    server: SETUP.server,
    authentication: {
        type: 'default',
        options: {
            userName: SETUP.username,
            password: SETUP.password
        }
    },
    options: {
        encrypt: false,
        database: SETUP.database,
        connectTimeout: 5000,
        port: SETUP.port_db,
    }
};

module.exports = { config };