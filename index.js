const app_runner = () => {

    console.log("\n\n████████╗██╗ ██████╗██╗  ██╗███████╗████████╗███████╗██████╗  ██╗");
    console.log("╚══██╔══╝██║██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝╚════██║╚════██╗███║");
    console.log("   ██║   ██║██║     █████╔╝ █████╗     ██║       ██╔╝ █████╔╝╚██║");
    console.log("   ██║   ██║██║     ██╔═██╗ ██╔══╝     ██║      ██╔╝ ██╔═══╝  ██║");
    console.log("   ██║   ██║╚██████╗██║  ██╗███████╗   ██║      ██║  ███████╗ ██║");
    console.log("   ╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝      ╚═╝  ╚══════╝ ╚═╝");
    console.log(":: Using Ticket721Hub from " + process.env.T721H_ADDRESS);
    console.log(":: Using Contract Sources from " + process.env.T721C_DIST_PATH);

    const express = require('express');
    const app = express();
    const empty = "                                          ";

    app.use(require('cookie-parser')());
    app.use(require('body-parser').urlencoded({extended: true}));
    app.use(require('express-session')({secret: 'U-u why ?', resave: false, saveUninitialized: false}));

    require('./routes/auth')(app);

    app.get('/', (req, res) => {
        if (!!req.user) {
            console.log(req.user.address + " :: /");
            res.send(JSON.stringify({logged: !!req.user, username: req.user.username}))
        } else {
            console.log(empty + " :: /");
            res.send(JSON.stringify({logged: !!req.user}));
        }
    });

    return app;
};


if (require.main === module) {
    app_runner().listen(process.env.PORT || 8080);
} else {
    module.exports = app_runner;
}
