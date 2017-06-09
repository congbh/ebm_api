const BaseController = require("./basecontroller"),
    _ = require("underscore"),
    swagger = require("swagger-node-restify")


class Degrees extends BaseController {
    constructor() {
        super()
    }
}

module.exports = (lib) => {
    let controller = new Degrees();

    // get
    controller.addAction({
        'path': '/degrees',
        'method': 'GET',
        'summary': 'Returns the list of degree ',
        'params': [swagger.queryParam('q', 'Search term', 'string')],
        'responseClass': 'Degree',
        'nickname': 'getDegrees'
    }, function (req, res, next) {
        var criteria = {}
        if (req.params.q) {
            let expr = new RegExp('.*' + req.params.q + '.*')
            criteria.$or = [
                { name: expr },
                { code: expr }
            ]
        }

        lib.db.model('Degree')
            .find(criteria)
            .exec(function (err, list) {
                if (err) return next(controller.RESTError('InternalServerError', err))
                controller.writeHAL(res, list)
            })
    })

    // get
    controller.addAction({
        'path': '/degrees/{id}',
        'method': 'GET',
        'params': [swagger.pathParam('id', 'The Id of the degree', 'int')],
        'summary': 'Returns the full data of a degree',
        'nickname': 'getDegree'
    }, function (req, res, next) {
        let id = req.params.id
        if (id) {
            lib.db.model('Degree')
                .findOne({ _id: id })
                .exec(function (err, degree) {
                    if (err) return next(controller.RESTError('InternalServerError', err))
                    if (!degree) {
                        return next(controller.RESTError('ResourceNotFoundError', 'degree not found'))
                    }
                    controller.writeHAL(res, degree)
                })
        } else {
            next(controller.RESTError('InvalidArgumentError', 'Missing degree id'))
        }
    })

    // post
    controller.addAction({
        'path': '/degrees',
        'method': 'POST',
        'params': [swagger.bodyParam('degree', 'JSON representation of the new degree', 'string')],
        'summary': 'Adds a new degree into the collection',
        'nickname': 'newDegree'
    }, function (req, res, next) {
        var body = req.body
        if (body) {
            var newDegree = lib.db.model('Degree')(body)
            newDegree.save(function (err, degree) {
                if (err) return next(controller.RESTError('InternalServerError', err))
                controller.writeHAL(res, degree)
            })
        } else {
            next(controller.RESTError('InvalidArgumentError', 'Missing degree id'))
        }
    })

    //put
    controller.addAction({
        'path': '/degrees/{id}',
        'method': 'PUT',
        'summary': "UPDATES an degree's information",
        'params': [swagger.pathParam('id', 'The id of the degree', 'string'),
        swagger.bodyParam('degree', 'The new information toupdate', 'string')],
        'responseClass': 'Degree',
        'nickname': 'updateDegree'
    }, function (req, res, next) {
        var data = req.body
        var id = req.params.id
        if (id) {
            lib.db.model("Degree")
                .findOne({ _id: id })
                .exec(function (err, degree) {
                    if (err) return next(controller.RESTError('InternalServerError', err))
                    if (!degree) return next(controller.RESTError('ResourceNotFoundError', 'Degree not found'))
                    degree = _.extend(degree, data)
                    degree.save(function (err, data) {
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