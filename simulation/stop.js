const compose = require("docker-compose");
const rimraf = require('rimraf');


const main = async () => {
    console.log("\n+--------------------------------------+");
    console.log("| Starting Simulation Teardown         |");
    console.log("+--------------------------------------+\n");
    await compose.down({cwd: './simulation', log: true});
    rimraf('./simulation/mongo_data', () => {
        console.log("\n+--------------------------------------+");
        console.log("| Simulation Teardown Successful       |");
        console.log("+--------------------------------------+\n");
        process.exit(0);
    });
};

main();
