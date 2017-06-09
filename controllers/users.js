const BaseController = require("./basecontroller"),
    _ = require("underscore"),
    swagger = require("swagger-node-restify"),
    jwt = require('jsonwebtoken');


class Users extends BaseController {
    constructor() {
        super()
    }
}

module.exports = function (lib) {
    var controller = new Users()

    controller.addAction({
        'path': '/signup',
        'method': 'POST',
        'summary': 'create a new user account ',
        'params': [swagger.bodyParam('user', 'JSON representation of the new user', 'string')],
        'responseClass': 'User',
        'nickname': 'userSignup'
    }, function (req, res, next) {
        var body = req.body
        if (body) {
            var newUser = lib.db.model('User')(body)
            newUser.save(function (err, User) {
                if (err) return next(controller.RESTError('InternalServerError', err))
                res.json({ success: true, msg: 'Successful created new user.' });
            })
        } else {
            next(controller.RESTError('InvalidArgumentError', 'No data received'))
        }
    })

    controller.addAction({
        'path': '/signin',
        'method': 'POST',
        'summary': 'create a new user account ',
        'params': [swagger.queryParam('email', 'The email of user', 'string'),
        swagger.queryParam('password', 'The password of user', 'string')],
        'responseClass': 'User',
        'nickname': 'userSignin'
    }, function (req, res, next) {
        let email = req.params.email,
            password = req.params.password;

        if (email && password) {
            lib.db.model('User')
                .findOne({ email: email }, function (err, user) {
                    if (err) {
                        next(controller.RESTError('InvalidArgumentError', err))
                    }
                    if (!user) {
                        next(controller.RESTError('UnauthorizedError', 'Authentication failed. User not found.'))
                    } else {
                        // check if password matches
                        user.comparePassword(password, function (err, isMatch) {
                            if (isMatch && !err) {
                                // if user is found and password is right create a token
                                var token = jwt.sign(user, lib.config.secretKey, {
                                    expiresIn: 10080 // in seconds
                                })
                                // return the information including token as JSON
                                res.json({ success: true, token: 'JWT ' + token });
                            } else {
                                next(controller.RESTError('UnauthorizedError', 'Authentication failed. Wrong password.'))
                            }
                        });
                    }
                })
        } else {
            next(controller.RESTError('InvalidArgumentError', 'No data received'))
        }
    })

    controller.addAction({
        'path': '/users',
        'method': 'GET',
        'summary': 'Returns the list of users ',
        'params': [swagger.queryParam('username', 'Filter the list of users by username', 'string'),
        swagger.queryParam('email', 'Filter the list of users by email', 'string'),
        swagger.queryParam('q', 'Filter the list of users by last name or first name', 'string')],
        'responseClass': 'User',
        'nickname': 'getUsers'
    }, function (req, res, next) {
        var criteria = {}
        if (req.params.q) {
            let expr = new RegExp('.*' + req.params.q + '.*')
            criteria.$or = [
                { last_name: expr },
                { first_name: expr }
            ]
        }

        if (req.params.username) {
            criteria.username = req.params.username
        }

        if (req.params.email) {
            criteria.email = req.params.email
        }

        lib.db.model('User')
            .find(criteria)
            .exec(function (err, list) {
                if (err) return next(controller.RESTError('InternalServerError', err))
                controller.writeHAL(res, list)
            })
    })

     controller.addAction({
        'path': '/users/{id}',
        'method': 'GET',
        'params': [swagger.pathParam('id', 'The Id of the user', 'int')],
        'summary': 'Returns the full data of a user',
        'responseClass': 'User',
        'nickname': 'getUser'
    }, function (req, res, next) {
        let id = req.params.id
        if (id) {
            lib.db.model('User')
                .findOne({ _id: id })
                .exec(function (err, user) {
                    if (err) return next(controller.RESTError('InternalServerError', err))
                    if (!user) {
                        return next(controller.RESTError('ResourceNotFoundError', 'User not found'))
                    }
                    controller.writeHAL(res, user)
                })
        } else {
            next(controller.RESTError('InvalidArgumentError', 'Missing user id'))
        }
    })

    // post
    controller.addAction({
        'path': '/users',
        'method': 'POST',
        'params': [swagger.bodyParam('user', 'JSON representation of the new user', 'string')],
        'summary': 'Adds a new user into the collection',
        'responseClass': 'User',
        'nickname': 'newUser'
    }, function (req, res, next) {
        var body = req.body
        if (body) {
            var newUser = lib.db.model('User')(body)
            newUser.save(function (err, user) {
                if (err) return next(controller.RESTError('InternalServerError', err))
                controller.writeHAL(res, user)
            })
        } else {
            next(controller.RESTError('InvalidArgumentError', 'No data received'))
        }
    })

    controller.addAction({
        'path': '/users/{id}',
        'method': 'PUT',
        'summary': "UPDATES a user's information",
        'params': [swagger.pathParam('id', 'The id of the user', 'string'),
        swagger.bodyParam('user', 'The new information to update', 'string')],
        'responseClass': 'User',
        'nickname': 'updateuser'
    }, function (req, res, next) {
        var data = req.body
        var id = req.params.id
        if (id) {
            lib.db.model("User")
                .findOne({ _id: id })
                .exec(function (err, user) {
                    if (err) return next(controller.RESTError('InternalServerError', err))
                    if (!user) return next(controller.RESTError('ResourceNotFoundError', 'user not found'))
                    user = _.extend(user, data)
                    user.save(function (err, data) {
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