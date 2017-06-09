module.exports = {
    secretKey: 'B11g286keG5a1KZ7OpuT48W5D4x5UjBU',
    server: {
        name: 'BMS API',
        version: '1.0.0',
        port: 9000
    },
    database: {
        // host: 'mongodb://localhost',
        // host: 'mongodb://admin:admin@ds149551.mlab.com:49551/congbh_bms',
        // dbname: 'congbh_bms'
        username: "admin",
        password: "admin",
        server: 'ds149551.mlab.com',
        port: '49551',
        db: 'congbh_bms',
        connectionString: function () {
            return 'mongodb://' + this.username + ':' + this.password + '@' + this.server + ':' + this.port + '/' + this.db
        },
        options: {
            server: {
                auto_reconnect: true,
                socketOptions: {
                    connectTimeoutMS: 3600000,
                    keepAlive: 3600000,
                    socketTimeoutMS: 3600000
                }
            }
        }
    }
}