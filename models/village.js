const mongoose = require("mongoose"),
    helpers = require("../lib/helpers"),
    _ = require("underscore")

module.exports = function (db) {
    let schema = require("../schemas/village.js")
    var modelDef = db.getModelFromSchema(schema)

    modelDef.schema.methods.toHAL = function () {
        var halObj = helpers.makeHAL(this.toJSON())
        return halObj
    }

    return mongoose.model(modelDef.name, modelDef.schema)
}