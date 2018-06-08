const app = require("../index.js");
const compose = require("docker-compose");

const isPortTaken = function(port, fn) {
    const net = require('net');
    const tester = net.createServer()
        .once('error', function (err) {
            if (err.code !== 'EADDRINUSE') return fn(err);
            fn(null, true)
        })
        .once('listening', function() {
            tester.once('close', function() { fn(null, false) })
                .close()
        })
        .listen(port)
};

module.exports = async () => new Promise(async (ok, ko) => {
    console.log("\n+--------------------------------------+");
    console.log("| Starting Test Setup                  |");
    console.log("+--------------------------------------+\n");

    let intervalId = setInterval(async () => {
        isPortTaken(8080, async (err, status) => {
            if (status === false) {
                clearInterval(intervalId);
                const res = await compose.up({cwd: './test', log: true});
                setTimeout(() => {
                    console.log("# Started docker-compose");
                    global.app = app().listen(8080);
                    setTimeout(() => {
                        console.log("# Started API Server");
                        console.log("\n+--------------------------------------+");
                        console.log("| Test Setup Successful                |");
                        console.log("+--------------------------------------+\n");
                        ok();
                    }, 5000);
                }, 5000);
            } else {
                console.warn("Port 8081 is taken, waiting ...");
            }
        });
    }, 5000);

});
