var cors = require('cors');

const app_runner = () => {

    //console.log("\n\n████████╗██╗ ██████╗██╗  ██╗███████╗████████╗███████╗██████╗  ██╗");
    //console.log("╚══██╔══╝██║██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝╚════██║╚════██╗███║");
    //console.log("   ██║   ██║██║     █████╔╝ █████╗     ██║       ██╔╝ █████╔╝╚██║");
    //console.log("   ██║   ██║██║     ██╔═██╗ ██╔══╝     ██║      ██╔╝ ██╔═══╝  ██║");
    //console.log("   ██║   ██║╚██████╗██║  ██╗███████╗   ██║      ██║  ███████╗ ██║");
    //console.log("   ╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝      ╚═╝  ╚══════╝ ╚═╝");
    console.log(":: Using Ticket721Hub from " + process.env.T721H_ADDRESS);
    console.log(":: Using Contract Sources from " + process.env.T721C_DIST_PATH);
    console.log(":: Master Address is " + process.env.T721_MASTER_ADDRESS);

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
        console.log((req.user ? req.user.address : empty) + " :: [" + res.statusCode + "] " + req.url);
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
