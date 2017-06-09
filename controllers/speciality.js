const BaseController = require("./basecontroller"),
    _ = require("underscore"),
    swagger = require("swagger-node-restify")


class Speciality extends BaseController {
    constructor() {
        super()
    }
}

module.exports = (lib) => {
    let controller = new Speciality();

    // get
    controller.addAction({
        'path': '/speciality',
        'method': 'GET',
        'summary': 'Returns the list of Speciality ',
        'params': [swagger.queryParam('q', 'Search term', 'string')],
        'responseClass': 'Speciality',
        'nickname': 'getSpeciality'
    }, function (req, res, next) {
        var criteria = {}
        if (req.params.q) {
            let expr = new RegExp('.*' + req.params.q + '.*')
            criteria.$or = [
                { name: expr },
                { code: expr }
            ]
        }

        lib.db.model('Speciality')
            .find(criteria)
            .exec(function (err, list) {
                if (err) return next(controller.RESTError('InternalServerError', err))
                controller.writeHAL(res, list)
            })
    })

    // get
    controller.addAction({
        'path': '/speciality/{id}',
        'method': 'GET',
        'params': [swagger.pathParam('id', 'The Id of the Speciality', 'int')],
        'summary': 'Returns the full data of a Speciality',
        'nickname': 'getSpeciality'
    }, function (req, res, next) {
        let id = req.params.id
        if (id) {
            lib.db.model('Speciality')
                .findOne({ _id: id })
                .exec(function (err, speciality) {
                    if (err) return next(controller.RESTError('InternalServerError', err))
                    if (!speciality) {
                        return next(controller.RESTError('ResourceNotFoundError', 'speciality not found'))
                    }
                    controller.writeHAL(res, speciality)
                })
        } else {
            next(controller.RESTError('InvalidArgumentError', 'Missing speciality id'))
        }
    })

    // post
    controller.addAction({
        'path': '/speciality',
        'method': 'POST',
        'params': [swagger.bodyParam('speciality', 'JSON representation of the new speciality', 'string')],
        'summary': 'Adds a new speciality into the collection',
        'nickname': 'newSpeciality'
    }, function (req, res, next) {
        var body = req.body
        if (body) {
            var newSpeciality = lib.db.model('Speciality')(body)
            newSpeciality.save(function (err, speciality) {
                if (err) return next(controller.RESTError('InternalServerError', err))
                controller.writeHAL(res, speciality)
            })
        } else {
            next(controller.RESTError('InvalidArgumentError', 'Missing speciality id'))
        }
    })

    //put
    controller.addAction({
        'path': '/speciality/{id}',
        'method': 'PUT',
        'summary': "UPDATES an speciality's information",
        'params': [swagger.pathParam('id', 'The id of the speciality', 'string'),
        swagger.bodyParam('speciality', 'The new information toupdate', 'string')],
        'responseClass': 'Speciality',
        'nickname': 'updateSpeciality'
    }, function (req, res, next) {
        var data = req.body
        var id = req.params.id
        if (id) {
            lib.db.model("Speciality")
                .findOne({ _id: id })
                .exec(function (err, speciality) {
                    if (err) return next(controller.RESTError('InternalServerError', err))
                    if (!speciality) return next(controller.RESTError('ResourceNotFoundError', 'Speciality not found'))
                    speciality = _.extend(speciality, data)
                    speciality.save(function (err, data) {
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