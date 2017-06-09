const BaseController = require("./basecontroller"),
    _ = require("underscore"),
    swagger = require("swagger-node-restify")


class Teachers extends BaseController {
    constructor() {
        super()
    }
}


module.exports = function (lib) {
    var controller = new Teachers();

    controller.addAction({
        'path': '/teachers',
        'method': 'GET',
        'summary': 'Returns the list of teachers ',
        'params': [swagger.queryParam('state', 'Filter the list of stores by state', 'string')],
        'responseClass': 'Teacher',
        'nickname': 'getTeachers'
    }, function (req, res, next) {
        var criteria = {}
        if (req.params.q) {
            let expr = new RegExp('.*' + req.params.q + '.*')
            criteria.$or = [
                { last_name: expr },
                { first_name: expr }
            ]
        }

        if (req.params.id_card) {
            criteria.id_card = req.params.id_card
        }

        if (req.params.degree) {
            criteria.degree = req.params.degree
        }

        if (req.params.speciality) {
            criteria.speciality = req.params.speciality
        }

        lib.db.model('Teacher')
            .find(criteria)
            .exec(function (err, list) {
                if (err) return next(controller.RESTError('InternalServerError', err))
                controller.writeHAL(res, list)
            })
    })

    controller.addAction({
        'path': '/teachers/{id}',
        'method': 'GET',
        'params': [swagger.pathParam('id', 'The Id of the teacher', 'int')],
        'summary': 'Returns the full data of a teacher',
        'responseClass': 'Teacher',
        'nickname': 'getTeacher'
    }, function (req, res, next) {
        let id = req.params.id
        if (id) {
            lib.db.model('Teacher')
                .findOne({ _id: id })
                .populate('degree')
                .populate('speciality')
                .exec(function (err, teacher) {
                    if (err) return next(controller.RESTError('InternalServerError', err))
                    if (!teacher) {
                        return next(controller.RESTError('ResourceNotFoundError', 'Teacher not found'))
                    }
                    controller.writeHAL(res, teacher)
                })
        } else {
            next(controller.RESTError('InvalidArgumentError', 'Missing teacher id'))
        }
    })

    // post
    controller.addAction({
        'path': '/teachers',
        'method': 'POST',
        'params': [swagger.bodyParam('teacher', 'JSON representation of the new teacher', 'string')],
        'summary': 'Adds a new teacher into the collection',
        'responseClass': 'Teacher',
        'nickname': 'newTeacher'
    }, function (req, res, next) {
        var body = req.body
        if (body) {
            var newTeacher = lib.db.model('Teacher')(body)
            newTeacher.save(function (err, teacher) {
                if (err) return next(controller.RESTError('InternalServerError', err))
                controller.writeHAL(res, teacher)
            })
        } else {
            next(controller.RESTError('InvalidArgumentError', 'No data received'))
        }
    })

    controller.addAction({
        'path': '/teachers/{id}',
        'method': 'PUT',
        'summary': "UPDATES a teacher's information",
        'params': [swagger.pathParam('id', 'The id of the teacher', 'string'),
        swagger.bodyParam('teacher', 'The new information to update', 'string')],
        'responseClass': 'Teacher',
        'nickname': 'updateTeacher'
    }, function (req, res, next) {
        var data = req.body
        var id = req.params.id
        if (id) {
            lib.db.model("Teacher")
                .findOne({ _id: id })
                .exec(function (err, teacher) {
                    if (err) return next(controller.RESTError('InternalServerError', err))
                    if (!teacher) return next(controller.RESTError('ResourceNotFoundError', 'teacher not found'))
                    teacher = _.extend(teacher, data)
                    teacher.save(function (err, data) {
                        if (err) return next(controller.RESTError('InternalServerError', err))
                        controller.writeHAL(res, data)
                    })
                })
        } else {
            next(controller.RESTError('InvalidArgumentError', 'Invalid idreceived'))
        }
    })

    return controller
}