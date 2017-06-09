const BaseController = require("./basecontroller"),
    _ = require("underscore"),
    swagger = require("swagger-node-restify")


class Districts extends BaseController {
    constructor() {
        super()
    }
}



module.exports = (lib) => {
    let controller = new Districts()

    controller.addAction({
        'path': '/districts',
        'method': 'GET',
        'summary': 'Returns the list of Districts',
        'params': [swagger.queryParam('name', 'Filter the list of Districts by name', 'string')],
        'responseClass': 'District',
        'nickname': 'getDistricts'
    }, function (req, res, next) {
        var criteria = {}
        if (req.params.name) {
            criteria.name = new RegExp(req.params.name, 'i')
        }
       
        lib.db.model('District')
            .find(criteria)
            .exec(function (err, list) {
                if (err) return next(controller.RESTError('InternalServerError', err))
                controller.writeHAL(res, list)
            })
    })

     controller.addAction({
        'path': '/districts/{id}',
        'method': 'GET',
        'params': [swagger.pathParam('id', 'The id of the district', 'string')],
        'summary': 'Returns the data of a district',
        'responseClass': 'District',
        'nickname': 'getDistrict'
    }, function (req, res, next) {
        var id = req.params.id
        if (id) {
            lib.db.model('District')
                .findOne({_id: id})
                .populate('villages')
                .exec(function (err, data) {
                    if (err) return next(controller.RESTError('InternalServerError', err))
                    if (!data) return next(controller.RESTError('ResourceNotFoundError', 'district not found'))
                    controller.writeHAL(res, data)
                })
        } else {
            next(controller.RESTError('InvalidArgumentError', 'Invalid id'))
        }
    })

    controller.addAction({
        'path': '/districts/{id}/villages',
        'method': 'GET',
        'params': [swagger.pathParam('id', 'The id of the district', 'string'),
        swagger.queryParam('q', 'Search parameter for the districts', 'string')],
        'summary': 'Returns the list of districts of a district',
        'responseClass': 'District',
        'nickname': 'getDistrictVillages'
    }, function (req, res, next) {
        var id = req.params.id
        if (id) {
            var criteria = { district: id }
            if (req.params.q) {
                var expr = new RegExp('.*' + req.params.q + '.*', 'i')
                criteria.$or = [
                    { name: expr }
                ]
            }
           
            lib.db.model('Village')
                .find(criteria)
                .exec(function (err, data) {
                    if (err) return next(controller.RESTError('InternalServerError', err))
                    controller.writeHAL(res, data)
                })
        } else {
            next(controller.RESTError('InvalidArgumentError', 'Invalid id'))
        }
    })

    controller.addAction({
        'path': '/districts',
        'method': 'POST',
        'summary': 'Adds a new District to the list',
        'params': [swagger.bodyParam('District', 'The JSON data of the District', 'string')],
        'responseClass': 'District',
        'nickname': 'newDistrict'
    }, function (req, res, next) {
        var data = req.body
        if (data) {
            var newDistrict = lib.db.model('District')(data)
            newDistrict.save(function (err, district) {
                if (err) return next(controller.RESTError('InternalServerError', err))
                controller.writeHAL(res, district)
            })
        } else {
            next(controller.RESTError('InvalidArgumentError', 'No data received'))
        }
    })

    controller.addAction({
        'path': '/districts/{id}',
        'method': 'PUT',
        'summary': "UPDATES a District's information",
        'params': [swagger.pathParam('id', 'The id of the District', 'string'), swagger.
            bodyParam('District', 'The new information to update', 'string')],
        'responseClass': 'District',
        'nickname': 'updateDistrict'
    }, function (req, res, next) {
        var data = req.body
        var id = req.params.id
        if (id) {
            lib.db.model("District").findOne({ _id: id }).exec(function (err, dstrict) {
                if (err) return next(controller.RESTError('InternalServerError', err))
                if (!dstrict) return next(controller.RESTError('ResourceNotFoundError', 'District not found'))
                dstrict = _.extend(dstrict, data)
                dstrict.save(function (err, data) {
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