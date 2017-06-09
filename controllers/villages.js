const BaseController = require("./basecontroller"),
    _ = require("underscore"),
    swagger = require("swagger-node-restify")


class Villages extends BaseController {
    constructor() {
        super()
    }
}

module.exports = (lib) => {
    let controller = new Villages();

    // get
    controller.addAction({
        'path': '/villages',
        'method': 'GET',
        'summary': 'Returns the list of village ',
        'params': [swagger.queryParam('q', 'Search term', 'string')],
        'responseClass': 'Village',
        'nickname': 'getVillages'
    }, function (req, res, next) {
        var criteria = {}
        if (req.params.q) {
            let expr = new RegExp('.*' + req.params.q + '.*')
            criteria.$or = [
                { name: expr },
                { code: expr }
            ]
        }

        lib.db.model('Village')
            .find(criteria)
            .exec(function (err, list) {
                if (err) return next(controller.RESTError('InternalServerError', err))
                controller.writeHAL(res, list)
            })
    })

    // get
    controller.addAction({
        'path': '/villages/{id}',
        'method': 'GET',
        'params': [swagger.pathParam('id', 'The Id of the village', 'int')],
        'summary': 'Returns the full data of a village',
        'nickname': 'getvillage'
    }, function (req, res, next) {
        let id = req.params.id
        if (id) {
            lib.db.model('Village')
                .findOne({ _id: id })
                .exec(function (err, village) {
                    if (err) return next(controller.RESTError('InternalServerError', err))
                    if (!village) {
                        return next(controller.RESTError('ResourceNotFoundError', 'village not found'))
                    }
                    controller.writeHAL(res, village)
                })
        } else {
            next(controller.RESTError('InvalidArgumentError', 'Missing village id'))
        }
    })

    // post
    controller.addAction({
        'path': '/villages',
        'method': 'POST',
        'params': [swagger.bodyParam('village', 'JSON representation of the new village', 'string')],
        'summary': 'Adds a new village into the collection',
        'nickname': 'newvillage'
    }, function (req, res, next) {
        var body = req.body
        if (body) {
            var newvillage = lib.db.model('Village')(body)
            newvillage.save(function (err, village) {
                if (err) return next(controller.RESTError('InternalServerError', err))
                controller.writeHAL(res, village)
            })
        } else {
            next(controller.RESTError('InvalidArgumentError', 'Missing village id'))
        }
    })

    //put
    controller.addAction({
        'path': '/villages/{id}',
        'method': 'PUT',
        'summary': "UPDATES an village's information",
        'params': [swagger.pathParam('id', 'The id of the village', 'string'),
        swagger.bodyParam('village', 'The new information toupdate', 'string')],
        'responseClass': 'village',
        'nickname': 'updatevillage'
    }, function (req, res, next) {
        var data = req.body
        var id = req.params.id
        if (id) {
            lib.db.model("Village")
                .findOne({ _id: id })
                .exec(function (err, village) {
                    if (err) return next(controller.RESTError('InternalServerError', err))
                    if (!village) return next(controller.RESTError('ResourceNotFoundError', 'village not found'))
                    village = _.extend(village, data)
                    village.save(function (err, data) {
                        if (err) return next(controller.RESTError('InternalServerError', err))
                        controller.writeHAL(data)
                    })
                })
        } else {
            next(controller.RESTError('InvalidArgumentError', 'Invalid idreceived'))
        }
    })

    return controller
}