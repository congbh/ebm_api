const mongoose = require("mongoose"),
    jsonSelect = require('mongoose-json-select'),
    helpers = require("../lib/helpers"),
    _ = require("underscore")

module.exports = function (db) {
    try {
        let schema = require("../schemas/province.js")
        let modelDef = db.getModelFromSchema(schema)
        modelDef.schema.plugin(jsonSelect, '-districts')
        modelDef.schema.methods.toHAL = function () {
            let halObj = helpers.makeHAL(this.toJSON(),
            [{
                name: 'districts', 'href': '/provinces/' + this.id + '/districts',
                'title': 'Districts'
            }])

            if (this.districts.length > 0) {
                    halObj.addEmbed('districts', _.map(this.districts,
                        function (e) { return e.toHAL() }))
            }

            return halObj
        }
        let model = mongoose.model(modelDef.name, modelDef.schema)
        return model
    } catch (error) {
        console.log("Error trying to read teacher schema: ".red, error.red)
    }
}