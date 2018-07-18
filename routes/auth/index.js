const challenges = {};
const Users = require('../../mongoose').User;
const randomstring = require("randomstring");
const Web3Utils = require('web3-utils');
const EthSigUtils = require('eth-sig-util');
const Ethers = require("ethers");
const jwt = require('jsonwebtoken');
const empty = "                                          ";

const auth = (app, passport) => {

    require('../../passport')(challenges, passport);
    app.use(passport.initialize());
    app.use(passport.session());

    app.post('/challenge', (req, res, next) => {
        if (!req.body.address) {
            res.status(500);
            res.send(JSON.stringify({
                error: 'Not logged in'
            }));
        } else {
            if (req.body.address.indexOf('0x') === -1)
                req.body.address = '0x' + req.body.address;
            req.body.address = Web3Utils.toChecksumAddress(req.body.address);
            const challenge =
                "===TICKET721CHALLENGE===\n" +
                randomstring.generate(48).match(/[\s\S]{24}/g).join("\n") +
                "\n========================";
            challenges[req.body.address] = challenge;
            res.send({
                challenge
            });
        }
        next();
    });

    app.post('/login',  function (req, res, next) {
        if (!req.body || !req.body.address || !req.body.signature) {
            res.status(500);
            res.send(JSON.stringify({
                error: 'Invalid Payload'
            }));
            return next();
        }
        let _address = req.body.address;
        const _signature = req.body.signature;
        if (!Web3Utils.isAddress(_address)) {
            res.status(500);
            res.send(JSON.stringify({
                error: 'Invalid Address'
            }));
            return next();
        }
        if (_address.indexOf('0x') === -1)
            _address = '0x' + _address;
        _address = Web3Utils.toChecksumAddress(_address);
        if (EthSigUtils.recoverTypedSignature({
            data: [{
                type: 'string',
                name: 'challenge',
                value: challenges[_address]
            }],
            sig: _signature
        }).toLowerCase() !== _address.toLowerCase()) {
            res.status(500);
            res.send(JSON.stringify({
                error: 'Invalid Signature'
            }));
            return next();
        }
        Users.findOne({address: _address}, (_err, _user) => {
            if (_err) {
                res.status(500);
                res.send(JSON.stringify({
                    error: 'Internal Error'
                }));
                return next();
            }
            if (!_user) {
                res.status(500);
                res.send(JSON.stringify({
                    error: 'No such user'
                }));
                return next();
            }
            const payload = {address: _address};
            const token = jwt.sign(payload, 'keykey');
            res.json({token});
            next();
        });
    });

    app.get('/logout', function (req, res, next) {
        try {
            delete challenges[req.user.address];
            req.logout();
            res.redirect('/');
        } catch (e) {
            res.status(500);
            res.send(JSON.stringify({
                error: 'Not logged in'
            }));
        }
        next();
    });

    app.post('/registered', (req, res, next) => {
        if (!req.body || !req.body.address) {
            res.status(500);
            res.send(JSON.stringify({
                error: "Missing address in registered request"
            }));
            return next();
        }
        let address;
        try {
            address = Web3Utils.toChecksumAddress(req.body.address);
        } catch (e) {
            res.status(500);
            res.send(JSON.stringify({
                error: "Invalid address"
            }));
            return next();
        }
        Users.findOne({address: address}, (err, user) => {
            if (err) {
                res.status(500);
                res.send(JSON.stringify({
                    error: "Internal Error"
                }));
                return next();
            }
            res.status(200);
            res.send(JSON.stringify({address: address, registered: !!user}));
            next();
        });
    });

    app.post('/register', (req, res, next) => {
        try {
            if (!req.body || !req.body.address || !req.body.signature) {
                res.status(500);
                res.send(JSON.stringify({
                    error: "Missing field in register request"
                }));
                return next();
            }
            if (!Web3Utils.isAddress(req.body.address)) {
                res.status(500);
                res.send(JSON.stringify({
                    error: "Username should be an Ethereum Address"
                }));
                return next();
            }
            if (req.body.address.indexOf('0x') === -1)
                req.body.address = '0x' + req.body.address;
            req.body.address = Web3Utils.toChecksumAddress(req.body.address);
            if (!Web3Utils.isAddress(req.body.address)) {
                res.status(500);
                res.send(JSON.stringify({
                    error: "Username should be an Ethereum Address"
                }));
                return next();
            }
            if (EthSigUtils.recoverTypedSignature({
                data: [{
                    type: 'string',
                    name: 'challenge',
                    value: challenges[req.body.address]
                }],
                sig: req.body.signature
            }).toLowerCase() !== req.body.address.toLowerCase()) {
                res.status(500);
                res.send(JSON.stringify({
                    error: "Invalid Signature"
                }));
                return next();
            }
            Users.findOne({address: req.body.address}, (_err, _user) => {
                if (_err) {
                    res.status(500);
                    res.send(JSON.stringify({
                        error: "Internal Error"
                    }));
                    return next();
                }
                if (_user) {
                    res.status(500);
                    res.send(JSON.stringify({
                        error: "Account for this address already exists"
                    }));
                    return next();
                }
                const registering = new Users({
                    address: req.body.address
                });
                registering.save((__err) => {
                    if (__err) {
                        res.status(500);
                        res.send(JSON.stringify({
                            error: "Internal Error"
                        }));
                        return next();
                    }
                    res.status(200);
                    res.send(JSON.stringify({
                        address: req.body.address
                    }));
                    next();
                })
            })
        } catch (e) {
            res.status(500);
            res.send(JSON.stringify({
                error: "Internal Error"
            }));
        }
    });

    app.get('/unregister', (req, res, next) => {
        next();
    });

};

module.exports = auth;
