const app = require("../index.js");
const compose = require("docker-compose");
const Fs = require("fs-extra");

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

const main = async () => {
    console.log("\n+--------------------------------------+");
    console.log("| Starting Simulation Setup            |");
    console.log("+--------------------------------------+\n");

    await compose.up({cwd: './simulation', log: true});
    setTimeout(() => {
        console.log("# Started docker-compose");
        console.log("\n+--------------------------------------+");
        console.log("| Simulation Setup Successful          |");
        console.log("+--------------------------------------+\n");
    }, 5000);

};

main();
