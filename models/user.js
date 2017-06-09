const mongoose = require("mongoose"),
    helpers = require("../lib/helpers"),
    bcrypt = require('bcrypt-nodejs')


module.exports = function (db) {
    let schema = require("../schemas/user.js")
    let modelDef = db.getModelFromSchema(schema)
    modelDef.schema.methods.toHAL = function () {
        let halObj = helpers.makeHAL(this.toJSON())
        return halObj
    }

    modelDef.schema.pre('save', function (next) {
        const user = this,
            SALT_FACTOR = 5

        if (!user.isModified('password')) return next()

        bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
            if (err) {
                return next(err)
            }

            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err)
                }
                user.password = hash
                next()
            })
        })
    })

    // Method to compare password for login
    modelDef.schema.methods.comparePassword = function (candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
            if (err) {
                return cb(err)
            }
            cb(null, isMatch)
        })
    }

    return mongoose.model(modelDef.name, modelDef.schema)
}