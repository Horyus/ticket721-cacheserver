const _Web3 = require("web3");
const T721CSAPI = require("./ticket721-csapi").T721CSAPI;
const randomstring = require("randomstring");

const _describe = () => {};

let Web3;
let api;
let coinbase;

let signatures = [];

describe("Testing Challenge", () => {


    beforeAll(async (done) => {
        Web3 = new _Web3(new _Web3.providers.HttpProvider("http://localhost:8550"));
      console.log("OK?");
        coinbase = await Web3.eth.getCoinbase();
      console.log("OK??");
        api = new T721CSAPI(process.env.API_URL || "http://localhost:8080", coinbase, Web3);
        done();
    });

    describe("Sign Challenges", () => {

        const sign_chall = async (chal, done) => {
            try {
                signatures.push({
                    challenge: chal,
                    signature: await api.signChallenge(chal)
                });
                process.stdout.write(":: signChallenge :: " + chal + "\n");
                done();
            } catch (e) {
                done(e);
            }
        };

        for (let idx = 0; idx < 100; ++idx) {
            test("Sign #" + (idx + 1), sign_chall.bind(null, randomstring.generate(idx + 1)));
        }

    });

    describe("Verify signatures", () => {

        const verify_sigs = async (idx, done)  => {
            try {
                if (!api.verify(signatures[idx].challenge, signatures[idx].signature, coinbase))
                    throw new Error("Invalid Signature " + signatures[idx].challenge);
                done();
            } catch (e) {
                done(e);
            }
        };

        for (let idx = 0; idx < 100; ++idx) {
            test("Verify #" + (idx + 1), verify_sigs.bind(null, idx));
        }
    });

});

describe("Auth Testing", () => {


    test("Register", async (done) => {
        await api.register();
        done();
    }, 30000);

    test("Login", async (done) => {
        if (await api.connect() === false) {
            done(new Error("Should have a logged status true"));
        } else {
            done();
        }
    }, 30000);

});


