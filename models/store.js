const mongoose = require("mongoose"),
    jsonSelect = require("mongoose-json-select"),
    _ = require("underscore"),
    helpers = require("../lib/helpers"),
    colors = require("colors");

module.exports = function (db) {
    try {
        let schema = require("../schemas/store.js")
        let modelDef = db.getModelFromSchema(schema)
        // console.log('modelDef >>', modelDef)
        modelDef.schema.plugin(jsonSelect, '-employees')
        modelDef.schema.methods.toHAL = function () {
            let halObj = helpers.makeHAL(this.toJSON(),
                [{
                    name: 'books', href: '/stores/' + this.id + '/books', title: 'Books'
                },
                { name: 'booksales', href: '/stores/' + this.id + '/booksales', title: 'Book Sales' }])
            if (this.employees.length > 0) {
                if (this.employees[0].toString().length != 24) {
                    halObj.addEmbed('employees', _.map(this.employees,
                        function (e) { return e.toHAL() }))
                }
            }
            return halObj
        }
        let model = mongoose.model(modelDef.name, modelDef.schema)
        return model
    } catch (error) {
        console.log("Error trying to connect to database: ".red, error.red)
    }
}