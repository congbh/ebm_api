var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    config = require("./config"),
    db = require("./db");

const jwtOptions = {
    // Telling Passport to check authorization headers for JWT
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    // Telling Passport where to find the secret
    secretOrKey: config.secretKey
    // TO-DO: Add issuer and audience checks
}

module.exports = new JwtStrategy(jwtOptions, function (jwt_payload, done) {
    db.model('User')
        .findOne({ id: jwt_payload.id }, function (err, user) {
            if (err) {
                return done(err, false)
            }
            if (user) {
                done(null, user)
            } else {
                done(null, false)
            }
        })
})