const jwt = require('jsonwebtoken'),
    config = require("./config"),
    db = require("./db");


/**
 *  The Auth Checker middleware function.
 */
module.exports = (req, res, next) => {
   
    if (req.url.indexOf("signup") != -1
        || req.url.indexOf("signin") != -1) {
        return next()
    }

    if (!req.headers.authorization) {
        return res.send(401, { error: true, msg: 'Invalid authentication' })
    }

    // get the last part from a authorization header string like "bearer token-value"
    const token = req.headers.authorization.split(' ')[1]
    
    // decode the token using a secret key-phrase
    return jwt.verify(token, config.secretKey, (err, decoded) => {
        // the 401 code is for unauthorized status
        
        if (err) {
            // return res.status(401).end()
            return res.send(401, { error: true, msg: 'Invalid authentication' })
        }

        const email = decoded._doc.email
        // check if a user exists
        return db.model('User')
            .findOne({ email: email }, function (err, user) {
                if (err || !user) {
                    return res.send(401, { error: true, msg: 'Invalid authentication' })
                }
                return next()
            })
    })
}