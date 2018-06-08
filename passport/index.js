const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Web3Utils = require('web3-utils');
const MongooseLink = require('../mongoose').User;
const Bcrypt = require("bcrypt");

passport.use(new LocalStrategy(
    (_username, _password, _cb) => {
        if (!Web3Utils.isAddress(_username)) {
            return _cb(null, false);
        }
        if (_username.indexOf('0x') === -1)
            _username = '0x' + _username;
        _username = Web3Utils.toChecksumAddress(_username);
        MongooseLink.findOne({username: _username}, (_err, _user) => {
            if (_err) { return _cb(_err) }
            if (!_user) { return _cb(null, false) }
            Bcrypt.compare(_password, _user.password, (__err, res) => {
                if (__err) { return _cb(__err) }
                if (!res) { return _cb(null, false) }
                return _cb(null, _user);
            });
        })
    }
));

passport.serializeUser((_user, _cb) => {
    _cb(null, _user.username);
});

passport.deserializeUser((_username, _cb) => {
    MongooseLink.findOne({username: _username}, (_err, _user) => {
        if (_err) { return _cb(_err) }
        if (!_user) { return _cb(null, false) }
        _cb(null, _user);
    });
});

module.exports = passport;

