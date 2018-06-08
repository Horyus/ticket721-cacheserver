const compose = require("docker-compose");
const rimraf = require('rimraf');


module.exports = async () => new Promise(async (ok, ko) => {
    console.log("\n+--------------------------------------+");
    console.log("| Starting Test Teardown               |");
    console.log("+--------------------------------------+\n");
    global.app.close();
    await compose.down({cwd: './test', log: true});
    rimraf('./test/mongo_data', () => {
        rimraf('/tmp/ticket721_cacheserver_block', () => {
            console.log("\n+--------------------------------------+");
            console.log("| Test Teardown Successful             |");
            console.log("+--------------------------------------+\n");
            process.exit(0);
        });
    });
});
