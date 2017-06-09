const mongoose = require("mongoose"),
    jsonSelect = require('mongoose-json-select'),
    helpers = require("../lib/helpers"),
    _ = require("underscore")

module.exports = function (db) {
    let schema = require("../schemas/employee.js")
    let modelDef = db.getModelFromSchema(schema)
    modelDef.schema.methods.toHAL = function () {
        let halObj = helpers.makeHAL(this.toJSON())
        return halObj
    }
    return mongoose.model(modelDef.name, modelDef.schema)
}