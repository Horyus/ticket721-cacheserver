var cors = require('cors');
const signale = require('signale');

const app_runner = () => {

    //signale.info("\n\n████████╗██╗ ██████╗██╗  ██╗███████╗████████╗███████╗██████╗  ██╗");
    //signale.info("╚══██╔══╝██║██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝╚════██║╚════██╗███║");
    //signale.info("   ██║   ██║██║     █████╔╝ █████╗     ██║       ██╔╝ █████╔╝╚██║");
    //signale.info("   ██║   ██║██║     ██╔═██╗ ██╔══╝     ██║      ██╔╝ ██╔═══╝  ██║");
    //signale.info("   ██║   ██║╚██████╗██║  ██╗███████╗   ██║      ██║  ███████╗ ██║");
    //signale.info("   ╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝      ╚═╝  ╚══════╝ ╚═╝");
    signale.info("Using Ticket721Hub from " + process.env.T721H_ADDRESS);
    signale.info("Using Contract Sources from " + process.env.T721C_DIST_PATH);
    signale.info("Master Address is " + process.env.T721_MASTER_ADDRESS);

    const express = require('express');
    const passport = require('passport');
    const app = express();
    const empty = "                                          ";

    app.use(require('cookie-parser')('key'));
    app.use(require('body-parser').urlencoded({extended: true}));
    app.use(cors({
        origin: 'http://127.0.0.1:8081',
        credentials: true,
        httpOnly: false
    }));

    require('./routes/auth')(app, passport);
    require('./eth_link')(app, passport);

    app.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
        if (!!req.user) {
            res.status(200);
            res.send(JSON.stringify({logged: !!req.user, username: req.user.username, public_wallet: req.user.public_wallet, verified_wallet: req.user.verified_wallet}))
            next();
        } else {
            res.status(200);
            res.send(JSON.stringify({logged: !!req.user}));
            next();
        }
    });

    function log(req, res, next){
        const options = {
            types: {
                info: {
                    label: (req.user ? req.user.address : empty)
                },
                error: {
                    label: (req.user ? req.user.address : empty)
                }
            }
        };
        const custom = new signale.Signale(options);
        if (res.statusCode >= 200 && res.statusCode <= 399) {
            custom.info(req.url);
        } else {
            custom.error(req.url);
        }
        next();
    }

    app.use(log);

    return app;
};

if (require.main === module) {
    app_runner().listen(process.env.PORT || 8080);
} else {
    module.exports = app_runner;
}
