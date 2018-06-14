const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Web3Utils = require('web3-utils');
const Ethers = require("ethers");
const MongooseLink = require('../mongoose').User;

function buildStrategy(challenges) {


    passport.use(new LocalStrategy({
            usernameField: 'address',
            passwordField: 'signature'},
        (_address, _signature, _cb) => {
            if (!Web3Utils.isAddress(_address)) {
                return _cb(null, false);
            }
            if (_address.indexOf('0x') === -1)
                _address = '0x' + _address;
            _address = Web3Utils.toChecksumAddress(_address);
            if (Ethers.Wallet.verifyMessage(challenges[_address], _signature) !== _address) {
                return _cb(null, false);
            }
            MongooseLink.findOne({address: _address}, (_err, _user) => {
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

