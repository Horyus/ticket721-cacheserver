var newman = require('newman');

describe("Testing Authentification Mechanisms", () => {

    it("Run Newman collection auth.test.collection.json", (done) => {
        newman.run({
            collection: require('./auth.test.collection.json'),
            reporters: 'cli'
        }, function (err) {
            done(err);
        });
    })


});
