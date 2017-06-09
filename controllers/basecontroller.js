var _ = require("underscore"),
	restify = require("restify"),
	colors = require("colors"),
	halson = require("halson")

class BaseController {
    constructor(){
        this.actions = []
        this.server = null

        this.setUpActions = (app, sw) => {
            this.server = app
            _.each(this.actions, function(act) {
                let method = act['spec']['method']
                console.log("Setting up auto-doc for (", method, ") - ", act['spec']['nickname'])
                sw['add' + method](act)
                app[method.toLowerCase()](act['spec']['path'], act['action'])
            })
        }

        this.addAction = (spec, fn) => {
            let newAct = {
                'spec': spec,
                action: fn
            }
            this.actions.push(newAct)
        }

        this.RESTError = (type, msg) => {
           if(restify[type]) {
               return new restify[type](msg.toString())
           } else {
               console.log("Type " + type + " of error not found".red)
           }
        }

        this.writeHAL = (res, obj) => {
            try {
                if (Array.isArray(obj)) {
                    var newArr = []
                    _.each(obj, function (item, k) {
                        item = item.toHAL()
                        newArr.push(item)
                    })
                    obj = halson(newArr) //lib.helpers.makeHAL(newArr)
                } else {
                    if (obj && obj.toHAL)
                        obj = obj.toHAL()
                }
                if (!obj) {
                    obj = {}
                }
                res.json(obj)
            } catch (error) {
                console.error('An error has occured in writeHAL function. Message: '.red + error.red)
            }
        }
    }
}

module.exports = BaseController
