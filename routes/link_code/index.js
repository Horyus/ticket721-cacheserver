const Web3Utils = require('web3-utils');
const RandomString = require('randomstring');
const _signale = require("signale");
const signale = new _signale.Signale();

const stored_addresses = {};

const link_code = (app, passport) => {

    app.post('/link_code', (req, res, next) => {
        if (!req.body || !req.body.address) {
            res.status(500);
            res.send(JSON.stringify({
                error: "Missing address field in link_code request"
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
        let code;
        while (!code || stored_addresses[code]) {
            code = RandomString.generate({
                length: 5,
                charset: 'abcdefghijklmnpqrstuvwxyz123456789',
                capitalisation: 'uppercase'
            }).toUpperCase();
        }
        stored_addresses[code] = {
            address,
            timestamp: Date.now()
        };
        res.status(200);
        res.send(JSON.stringify({
            code: code
        }));
        return next();
    });

    app.get('/link_code/:code', (req, res, next) => {
        if (!req.params.code) {
            res.status(500);
            res.send(JSON.stringify({
                error: "Missing code"
            }));
            return next();
        }
        if (!stored_addresses[req.params.code]) {
            res.status(500);
            res.send(JSON.stringify({
                error: "Invalid Code"
            }));
            return next();
        }
        res.status(200);
        res.send(JSON.stringify({
            address: stored_addresses[req.params.code].address
        }));
        return next();
    });

    setInterval(() => {
        for (const id of Object.keys(stored_addresses)) {
            if (Date.now() - stored_addresses[id].timestamp >= 60000) {
                signale.info('Removing ' + id + " " + stored_addresses[id].address);
                delete stored_addresses[id];
            }
        }
    }, 60000);

};

module.exports = link_code;
