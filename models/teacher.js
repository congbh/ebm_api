const mongoose = require("mongoose"),
    jsonSelect = require('mongoose-json-select'),
    helpers = require("../lib/helpers"),
    _ = require("underscore")

module.exports = function (db) {
    try {
        let schema = require("../schemas/teacher.js")
        let modelDef = db.getModelFromSchema(schema)
        modelDef.schema.plugin(jsonSelect, '-degree -speciality')
        modelDef.schema.methods.toHAL = function () {
            let halObj = helpers.makeHAL(this.toJSON())
            return halObj
        }
        let model = mongoose.model(modelDef.name, modelDef.schema)
        return model
    } catch (error) {
        console.log("Error trying to read teacher schema: ".red, error.red)
    }
}