var lib = {
    helpers: require("./helpers"),
    config: require("./config"),
    controllers: require("../controllers"),
    schemas: require("../schemas"),
    schemaValidator: require("./schemaValidator"),
    db: require("./db"),
    authChecker: require("./authChecker"),
    passport: require("./passport")
}
module.exports = lib