const challenges = {};
const passport = require('../../passport')(challenges);
const Users = require('../../mongoose').User;
const randomstring = require("randomstring");
const Web3Utils = require('web3-utils');
const Ethers = require("ethers");
const Bcrypt = require("bcrypt");
const empty = "                                          ";

const auth = (app) => {

    app.use(passport.initialize());
    app.use(passport.session());

    app.post('/challenge', (req, res) => {
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
                randomstring.generate(240).match(/[\s\S]{24}/g).join("\n") +
                "\n========================";
            challenges[req.body.address] = challenge;
            res.send({
                challenge
            });
        }
    });

    app.post('/login', passport.authenticate('local', {failureRedirect: '/'}), function (req, res) {
        if (req.user)
            console.log(req.user.address + " :: /login");
        else
            console.log(empty + " :: /login fail");
        res.redirect('/');
    });

    app.get('/logout', function (req, res) {
        try {
            console.log(req.user.address + " :: /logout");
            delete challenges[req.user.address];
            req.logout();
            res.redirect('/');
        } catch (e) {
            res.status(500);
            res.send(JSON.stringify({
                error: 'Not logged in'
            }));
        }
    });

    app.post('/register', (req, res) => {
        console.log(empty + " :: /register");
        try {
            if (!req.body || !req.body.address || !req.body.signature) {
                res.status(500);
                res.send(JSON.stringify({
                    error: "Missing field in register request"
                }));
                return ;
            }
            if (!Web3Utils.isAddress(req.body.address)) {
                res.status(500);
                res.send(JSON.stringify({
                    error: "Username should be an Ethereum Address"
                }));
                return ;
            }
            if (req.body.address.indexOf('0x') === -1)
                req.body.address = '0x' + req.body.address;
            req.body.address = Web3Utils.toChecksumAddress(req.body.address);
            if (!Web3Utils.isAddress(req.body.address)) {
                res.status(500);
                res.send(JSON.stringify({
                    error: "Username should be an Ethereum Address"
                }));
                return ;
            }
            if (Ethers.Wallet.verifyMessage(challenges[req.body.address], req.body.signature) !== req.body.address) {
                res.status(500);
                res.send(JSON.stringify({
                    error: "Invalid Signature"
                }));
                return ;
            }
            Users.findOne({address: req.body.address}, (_err, _user) => {
                if (_err) {
                    res.status(500);
                    res.send(JSON.stringify({
                        error: "Internal Error"
                    }));
                    return;
                }
                if (_user) {
                    res.status(500);
                    res.send(JSON.stringify({
                        error: "Account for this address already exists"
                    }));
                    return;
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
                        return;
                    }
                    res.status(200);
                    res.send(JSON.stringify({
                        address: req.body.address
                    }));
                })
            })
        } catch (e) {
            res.status(500);
            res.send(JSON.stringify({
                error: "Internal Error"
            }));
        }
    });

    app.get('/unregister', (req, res) => {

    });

};

module.exports = auth;
