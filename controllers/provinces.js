const BaseController = require("./basecontroller"),
    _ = require("underscore"),
    swagger = require("swagger-node-restify")


class Provinces extends BaseController {
    constructor() {
        super()
    }
}


module.exports = (lib) => {
    let controller = new Provinces()

    controller.addAction({
        'path': '/provinces',
        'method': 'GET',
        'summary': 'Returns the list of provinces',
        'params': [swagger.queryParam('name', 'Filter the list of provinces by name', 'string')],
        'responseClass': 'Province',
        'nickname': 'getProvinces'
    }, function (req, res, next) {
        var criteria = {}
        if (req.params.name) {
            criteria.name = new RegExp(req.params.name, 'i')
        }
       
        lib.db.model('Province')
            .find(criteria)
            .exec(function (err, list) {
                if (err) return next(controller.RESTError('InternalServerError', err))
                controller.writeHAL(res, list)
            })
    })

    controller.addAction({
        'path': '/provinces/{id}',
        'method': 'GET',
        'params': [swagger.pathParam('id', 'The id of the province', 'string')],
        'summary': 'Returns the data of a province',
        'responseClass': 'Province',
        'nickname': 'getProvince'
    }, function (req, res, next) {
        var id = req.params.id
        if (id) {
            lib.db.model('Province')
                .findOne({_id: id})
                .populate('districts')
                .exec(function (err, data) {
                    if (err) return next(controller.RESTError('InternalServerError', err))
                    if (!data) return next(controller.RESTError('ResourceNotFoundError', 'Province not found'))
                    controller.writeHAL(res, data)
                })
        } else {
            next(controller.RESTError('InvalidArgumentError', 'Invalid id'))
        }
    })

    controller.addAction({
        'path': '/provinces/{id}/districts',
        'method': 'GET',
        'params': [swagger.pathParam('id', 'The id of the province', 'string'),
        swagger.queryParam('q', 'Search parameter for the districts', 'string')],
        'summary': 'Returns the list of districts of a province',
        'responseClass': 'District',
        'nickname': 'getProvinceDistricts'
    }, function (req, res, next) {
        var id = req.params.id
        if (id) {
            var criteria = { province: id }
            if (req.params.q) {
                var expr = new RegExp('.*' + req.params.q + '.*', 'i')
                criteria.$or = [
                    { name: expr }
                ]
            }
           
            lib.db.model('District')
                .find(criteria)
                .populate('villages')
                .exec(function (err, data) {
                    if (err) return next(controller.RESTError('InternalServerError', err))
                    controller.writeHAL(res, data)
                })
        } else {
            next(controller.RESTError('InvalidArgumentError', 'Invalid id'))
        }
    })

    controller.addAction({
        'path': '/provinces',
        'method': 'POST',
        'summary': 'Adds a new province to the list',
        'params': [swagger.bodyParam('province', 'The JSON data of the province', 'string')],
        'responseClass': 'Province',
        'nickname': 'newProvince'
    }, function (req, res, next) {
        var data = req.body
        if (data) {
            var newProvince = lib.db.model('Province')(data)
            newProvince.save(function (err, province) {
                if (err) return next(controller.RESTError('InternalServerError', err))
                controller.writeHAL(res, province)
            })
        } else {
            next(controller.RESTError('InvalidArgumentError', 'No data received'))
        }
    })

    controller.addAction({
        'path': '/provinces/{id}',
        'method': 'PUT',
        'summary': "UPDATES a Province's information",
        'params': [swagger.pathParam('id', 'The id of the Province', 'string'), swagger.
            bodyParam('province', 'The new information to update', 'string')],
        'responseClass': 'Province',
        'nickname': 'updateProvince'
    }, function (req, res, next) {
        var data = req.body
        var id = req.params.id
        if (id) {
            lib.db.model("Province").findOne({ _id: id }).exec(function (err, province) {
                if (err) return next(controller.RESTError('InternalServerError', err))
                if (!province) return next(controller.RESTError('ResourceNotFoundError', 'Province not found'))
                province = _.extend(province, data)
                province.save(function (err, data) {
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