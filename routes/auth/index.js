const passport = require('../../passport');
const Users = require('../../mongoose').User;
const Web3Utils = require('web3-utils');
const Bcrypt = require("bcrypt");
const empty = "                                          ";

const auth = (app) => {

    app.use(passport.initialize());
    app.use(passport.session());

    app.post('/login', passport.authenticate('local', {failureRedirect: '/'}), function (req, res) {
        if (req.user)
            console.log(req.user.username + " :: /login");
        else
            console.log(empty + " :: /login fail");
        res.redirect('/');
    });

    app.get('/logout', function (req, res) {
        try {
            console.log(req.user.username + " :: /logout");
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
            if (!req.body || !req.body.username || !req.body.password) {
                res.status(500);
                res.send(JSON.stringify({
                    error: "Missing field in register request"
                }));
            }
            if (req.body.username.indexOf('0x') === -1)
                req.body.username = '0x' + req.body.username;
            req.body.username = Web3Utils.toChecksumAddress(req.body.username);
            if (!Web3Utils.isAddress(req.body.username)) {
                res.status(500);
                res.send(JSON.stringify({
                    error: "Username should be an Ethereum Address"
                }));
            }
            Users.findOne({username: req.body.username}, (_err, _user) => {
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
                    username: req.body.username,
                    password: Bcrypt.hashSync(req.body.password, 10)
                });
                registering.save((__err) => {
                    if (__err) {
                        res.status(500);
                        res.send(JSON.stringify({
                            error: "Internal Error"
                        }));
                        console.error(_err);
                        return;
                    }
                    res.status(200);
                    res.send(JSON.stringify({
                        username: req.body.username
                    }));
                })
            })
        } catch (e) {
            res.status(500);
            res.send(JSON.stringify({
                error: "Internal Error"
            }));
            console.error(e);
        }
    });

    app.get('/unregister', (req, res) => {
        if (req.user) {
            console.log(req.user.username + " :: /unregister");
            Users.remove({username: req.user.username}, (err) => {
                if (err) {
                    res.status(500);
                    res.send(JSON.stringify({
                        error: "You are not logged in"
                    }));
                    console.error(err);
                    return ;
                }
                req.logout();
                res.redirect('/');
            })
        } else {
            console.log(empty + " :: /unregister");
            res.status(500);
            res.send(JSON.stringify({
                error: "You are not logged in"
            }));
        }
    });

};

module.exports = auth;
