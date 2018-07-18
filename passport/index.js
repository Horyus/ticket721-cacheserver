const JwTStrategy = require('passport-jwt').Strategy;
const JwTExtract = require('passport-jwt').ExtractJwt;
const MongooseLink = require('../mongoose').User;

function buildStrategy(challenges, passport) {

    const jwtOptions = {};
    jwtOptions.jwtFromRequest = JwTExtract.fromAuthHeaderAsBearerToken();
    jwtOptions.secretOrKey = 'keykey';

    passport.use(new JwTStrategy(jwtOptions,
        (payload, _cb) => {
            MongooseLink.findOne({address: payload.address}, (_err, _user) => {
                if (_err) {
                    return _cb(_err)
                }
                if (!_user) {
                    return _cb(null, false)
                }
                return (_cb(null, _user));
            })
        }
    ));

    passport.serializeUser((_user, _cb) => {
        _cb(null, _user.address);
    });

    passport.deserializeUser((_address, _cb) => {
        MongooseLink.findOne({address: _address}, (_err, _user) => {
            if (_err) {
                return _cb(_err)
            }
            if (!_user) {
                return _cb(null, false)
            }
            _cb(null, _user);
        });
    });

    return passport;
}

module.exports = buildStrategy;

