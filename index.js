var restify = require("restify"),
    colors = require("colors"),
    lib = require("./lib"),
    swagger = require("swagger-node-restify"),
    passport = require('passport'),
    config = lib.config;

var server = restify.createServer(lib.config.server)
//Middleware setup
server.use(restify.fullResponse())
    .use(restify.queryParser())
    .use(restify.bodyParser())

// restify.defaultResponseHeaders = function (data) {
//     this.header('Access-Control-Allow-Origin', '*')
//     this.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
//     this.header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
// }

server.use(
    function crossOrigin(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        return next();
    }
);

// server.use(function (req, res, next) {
//     if (req.headers['x-forwarded-proto'] === 'http') {
//         next();
//     } else {
//         res.redirect('http://' + req.hostname + req.url, next);
//     }
// })

server.use(lib.authChecker)

passport.use(lib.passport)

///Middleware to check for valid api key sent
// server.use(function (req, res, next) {
//     //We move forward if we're dealing with the swagger-ui or a valid key
//     if (req.url.indexOf("swagger-ui") != -1 
//         || req.url.indexOf("signup") != -1 
//         || req.url.indexOf("signin") != -1 
//         || lib.helpers.validateKey(req.headers.hmacdata || '', req.params.api_key, lib)) {
//         next()
//     } else {
//         res.send(401, { error: true, msg: 'Invalid api key sent' })
//     }
// })

/**
Validate each request, as long as there is a schema for it
*/
server.use(function (req, res, next) {
    var results = lib.schemaValidator.validateRequest(req)
    if (results.valid) {
        next()
    } else {
        res.send(400, results)
    }
})

//the swagger-ui is inside the "swagger-ui" folder
server.get(/^\/swagger-ui(\/.*)?/, restify.serveStatic({
    directory: __dirname + '/',
    default: 'index.html'
}))


//setup section
swagger.addModels(lib.schemas)
swagger.setAppHandler(server)
lib.helpers.setupRoutes(server, swagger, lib)
swagger.configureSwaggerPaths("", "/api-docs", "") //we remove the {format} part of the paths, to
// swagger.configure('http://localhost:9000', '0.1')
swagger.configure('http://' + config.server.host + ':' + config.server.port, '0.1')
//start the server
server.listen(config.server.port, function () {
    console.log(("Server started succesfully on port " + config.server.port + "…").green)
    lib.db.connect(function (err) {
        if (err)
            console.log("Error trying to connect to database: ".red, err.red)
        else console.log("Database service successfully started".green)
    })
})

