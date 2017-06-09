const mongoose = require("mongoose"),
    jsonSelect = require('mongoose-json-select'),
    helpers = require("../lib/helpers"),
    _ = require("underscore")

module.exports = function (db) {
    try {
        let schema = require("../schemas/district.js")
        let modelDef = db.getModelFromSchema(schema)
        modelDef.schema.plugin(jsonSelect, '-villages')
        modelDef.schema.methods.toHAL = function () {
            let halObj = helpers.makeHAL(this.toJSON(),
            [{
                name: 'villages', 'href': '/districts/' + this.id + '/villages',
                'title': 'Villages'
            }])

            if (this.villages.length > 0) {
                    halObj.addEmbed('villages', _.map(this.villages,
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