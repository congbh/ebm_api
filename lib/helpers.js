var halson = require("halson"),
    _ = require("underscore"),
    jwt = require('jsonwebtoken');

module.exports = {
    makeHAL: makeHAL,
    setupRoutes: setupRoutes,
    validateKey: validateKey,
    authChecker: authChecker
}

function setupRoutes(server, swagger, lib) {
    for (controller in lib.controllers) {
        cont = lib.controllers[controller](lib)
        cont.setUpActions(server, swagger)
    }
}

function validateKey(hmacdata, key, lib) {
    //  console.log('hmacdata >', hmacdata)
    //This is for testing the swagger-ui, should be removed after development to avoid possible security problem :)
    if (+key == 777) return true
    var hmac = require("crypto").createHmac("md5", lib.config.secretKey)
        .update(hmacdata)
        .digest("hex");
    //TODO: Remove this line
    console.log('hmac >', hmac)
    // console.log('key >', key)
    // console.log('result >', hmac === key)
    return hmac === key
}

function makeHAL(data, links, embed) {
    var obj = halson(data)
    if (links && links.length > 0) {
        _.each(links, function (lnk) {
            obj.addLink(lnk.name, {
                href: lnk.href,
                title: lnk.title || ''
            })
        })
    }
    if (embed && embed.length > 0) {
        _.each(embed, function (item) {
            obj.addEmbed(item.name, item.data)
        })
    }
    return obj
}

function authChecker(config, req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).end();
    }

    // get the last part from a authorization header string like "bearer token-value"
    const token = req.headers.authorization.split(' ')[1];
    // decode the token using a secret key-phrase
    return jwt.verify(token, config.secretKey, (err, decoded) => {
        // the 401 code is for unauthorized status
        if (err) { return res.status(401).end(); }

        const userId = decoded.sub;

        // check if a user exists
        return lib.db.model('User')
            .findById(userId, (userErr, user) => {
                if (userErr || !user) {
                    return res.status(401).end();
                }

                return next();
            });
    });
}