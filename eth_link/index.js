const Web3 = require("web3");
const empty = "                                          ";

const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8545"));
const Ticket721HubArtifact = require(process.env.T721C_DIST_PATH + "/contracts/Ticket721Hub");
const Ticket721Artifact = require(process.env.T721C_DIST_PATH + "/contracts/Ticket721");
const Ticket721ControllerArtifact = require(process.env.T721C_DIST_PATH + "/contracts/Ticket721Controller");
const Ticket721VerifiedAccountsArtifact = require(process.env.T721C_DIST_PATH + "/contracts/Ticket721VerifiedAccounts");

const Ticket721Hub = new web3.eth.Contract(Ticket721HubArtifact.abiDefinition, process.env.T721H_ADDRESS);

let Ticket721;
let Ticket721Verified;
let Ticket721VerifiedAccounts;

async function get_creation_block() {
    try {
        let blockNumberHigh = await web3.eth.getBlockNumber();
        let blockNumberLow = 0;
        let highCode = await web3.eth.getCode(process.env.T721H_ADDRESS, blockNumberHigh);
        let lowCode = await web3.eth.getCode(process.env.T721H_ADDRESS, blockNumberLow);

        let height = 0;

        while (highCode.length > 2 && lowCode.length <= 2) {
            --blockNumberHigh;
            ++blockNumberLow;
            highCode = await web3.eth.getCode(process.env.T721H_ADDRESS, blockNumberHigh);
            lowCode = await web3.eth.getCode(process.env.T721H_ADDRESS, blockNumberLow);
        }
        if (lowCode.length > 2) {
            height = blockNumberLow;
        } else if (highCode.length <= 2) {
            height = blockNumberHigh + 1;
        } else {
            throw new Error("Error while searching initial block number");
        }

        return height;
    } catch (e) {
        console.error(e);
    }
}

async function get_addresses() {

    try {
        const verified_ticket_registry_address = await Ticket721Hub.methods.verified_ticket_registries(0).call();
        const public_ticket_registry_address = await Ticket721Hub.methods.public_ticket_registries(0).call();
        const verified_account_registry_address = await Ticket721Hub.methods.account_manager().call();

        return ([verified_ticket_registry_address, public_ticket_registry_address, verified_account_registry_address])


    } catch (e) {
        console.error(":: Unable to recover ticket registries addresses");
    }

}

async function load_contracts(verified_ticket_registry_address, public_ticket_registry_address, verified_accounts_registry_address) {
    try {
        Ticket721 = new web3.eth.Contract(Ticket721Artifact.abiDefinition, public_ticket_registry_address);
        console.log(":: Loaded Public Ticket Registry at " + public_ticket_registry_address);
        Ticket721Verified = new web3.eth.Contract(Ticket721Artifact.abiDefinition, verified_ticket_registry_address);
        console.log(":: Loaded Verified Ticket Registry at " + verified_ticket_registry_address);
        Ticket721VerifiedAccounts = new web3.eth.Contract(Ticket721VerifiedAccountsArtifact.abiDefinition, verified_accounts_registry_address);
        console.log(":: Loaded Verified Account Registry at " + verified_accounts_registry_address);
    } catch (e) {
        console.error(":: Unable to recover ticket registries");
    }
}

async function synchronize_eventsale(infos) {
    const EventSale = global.mongoose.EventSale;
    const highest = await EventSale.find({}, ['block'], {
        limit: 1,
        sort: {
            block: -1,
        }
    });
    const start = highest.length ? highest[0].block + 1 : infos.block_number;
    console.log(":: Fetching Event Sale from block " + start);
    Ticket721.events.Sale({fromBlock: start}, async (err, event) => {
        const insert = new EventSale({
            block: event.blockNumber,
            hash: event.transactionHash,
            owner: event.returnValues['0'],
            id: event.returnValues['1']
        });
        await insert.save();
        console.log(":: Sale [ " + event.transactionHash + " ]");
    });
}

async function synchronize_eventbuy(infos) {
    const EventBuy = global.mongoose.EventBuy;
    const highest = await EventBuy.find({}, ['block'], {
        limit: 1,
        sort: {
            block: -1,
        }
    });
    const start = highest.length ? highest[0].block + 1 : infos.block_number;
    console.log(":: Fetching Event Buy from block " + start);
    Ticket721.events.Buy({fromBlock: start}, async (err, event) => {
        const insert = new EventBuy({
            block: event.blockNumber,
            hash: event.transactionHash,
            buyer: event.returnValues['0'],
            id: event.returnValues['1']
        });
        await insert.save();
        console.log(":: Buy [ " + event.transactionHash + " ]");
    });
}

async function synchronize_eventregister(infos) {
    const EventRegister = global.mongoose.EventRegister;
    const highest = await EventRegister.find({}, ['block'], {
        limit: 1,
        sort: {
            block: -1,
        }
    });
    const start = highest.length ? highest[0].block + 1 : infos.block_number;
    console.log(":: Fetching Event Register from block " + start);
    Ticket721.events.Register({fromBlock: start}, async (err, event) => {
        const insert = new EventRegister({
            block: event.blockNumber,
            hash: event.transactionHash,
            controller: event.returnValues['0']
        });
        await insert.save();
        console.log(":: Register [ " + event.transactionHash + " ]");
    });
}

async function synchronize_eventtransfer(infos) {
    const EventTransfer = global.mongoose.EventTransfer;
    const highest = await EventTransfer.find({}, ['block'], {
        limit: 1,
        sort: {
            block: -1,
        }
    });
    const start = highest.length ? highest[0].block + 1 : infos.block_number;
    console.log(":: Fetching Event Transfer from block " + start);
    Ticket721.events.Transfer({fromBlock: start}, async (err, event) => {
        const insert = new EventTransfer({
            block: event.blockNumber,
            hash: event.transactionHash,
            from: event.returnValues['0'],
            to: event.returnValues['1'],
            id: event.returnValues['2']
        });
        await insert.save();
        console.log(":: Transfer [ " + event.transactionHash + " ]");
    });
}

async function synchronize_eventapproval(infos) {
    const EventApproval = global.mongoose.EventApproval;
    const highest = await EventApproval.find({}, ['block'], {
        limit: 1,
        sort: {
            block: -1,
        }
    });
    const start = highest.length ? highest[0].block + 1 : infos.block_number;
    console.log(":: Fetching Event Approval from block " + start);
    Ticket721.events.Approval({fromBlock: start}, async (err, event) => {
        const insert = new EventApproval({
            block: event.blockNumber,
            hash: event.transactionHash,
            owner: event.returnValues['0'],
            approved: event.returnValues['1'],
            id: event.returnValues['2']
        });
        await insert.save();
        console.log(":: Approval [ " + event.transactionHash + " ]");
    });
}

async function synchronize_eventapprovalforall(infos) {
    const EventApprovalForAll = global.mongoose.EventApprovalForAll;
    const highest = await EventApprovalForAll.find({}, ['block'], {
        limit: 1,
        sort: {
            block: -1,
        }
    });
    const start = highest.length ? highest[0].block + 1 : infos.block_number;
    console.log(":: Fetching Event ApprovalForAll from block " + start);
    Ticket721.events.ApprovalForAll({fromBlock: start}, async (err, event) => {
        const insert = new EventApprovalForAll({
            block: event.blockNumber,
            hash: event.transactionHash,
            owner: event.returnValues['0'],
            operator: event.returnValues['1'],
            approved: event.returnValues['2']
        });
        await insert.save();
        console.log(":: ApprovalForAll [ " + event.transactionHash + " ]");
    });
}

async function synchronize_eventsaleverified(infos) {
    const EventSaleVerified = global.mongoose.EventSaleVerified;
    const highest = await EventSaleVerified.find({}, ['block'], {
        limit: 1,
        sort: {
            block: -1,
        }
    });
    const start = highest.length ? highest[0].block + 1 : infos.block_number;
    console.log(":: Fetching Event Sale (Verified) from block " + start);
    Ticket721Verified.events.Sale({fromBlock: start}, async (err, event) => {
        const insert = new EventSaleVerified({
            block: event.blockNumber,
            hash: event.transactionHash,
            owner: event.returnValues['0'],
            id: event.returnValues['1']
        });
        await insert.save();
        console.log(":: Sale (Verified) [ " + event.transactionHash + " ]");
    });
}

async function synchronize_eventbuyverified(infos) {
    const EventBuyVerified = global.mongoose.EventBuyVerified;
    const highest = await EventBuyVerified.find({}, ['block'], {
        limit: 1,
        sort: {
            block: -1,
        }
    });
    const start = highest.length ? highest[0].block + 1 : infos.block_number;
    console.log(":: Fetching Event Buy (Verified) from block " + start);
    Ticket721Verified.events.Buy({fromBlock: start}, async (err, event) => {
        const insert = new EventBuyVerified({
            block: event.blockNumber,
            hash: event.transactionHash,
            buyer: event.returnValues['0'],
            id: event.returnValues['1']
        });
        await insert.save();
        console.log(":: Buy (Verified) [ " + event.transactionHash + " ]");
    });
}

async function synchronize_eventregisterverified(infos) {
    const EventRegisterVerified = global.mongoose.EventRegisterVerified;
    const highest = await EventRegisterVerified.find({}, ['block'], {
        limit: 1,
        sort: {
            block: -1,
        }
    });
    const start = highest.length ? highest[0].block + 1 : infos.block_number;
    console.log(":: Fetching Event Register (Verified) from block " + start);
    Ticket721Verified.events.Register({fromBlock: start}, async (err, event) => {
        const insert = new EventRegisterVerified({
            block: event.blockNumber,
            hash: event.transactionHash,
            controller: event.returnValues['0']
        });
        await insert.save();
        console.log(":: Register (Verified) [ " + event.transactionHash + " ]");
    });
}

async function synchronize_eventtransferverified(infos) {
    const EventTransferVerified = global.mongoose.EventTransferVerified;
    const highest = await EventTransferVerified.find({}, ['block'], {
        limit: 1,
        sort: {
            block: -1,
        }
    });
    const start = highest.length ? highest[0].block + 1 : infos.block_number;
    console.log(":: Fetching Event Transfer (Verified) from block " + start);
    Ticket721Verified.events.Transfer({fromBlock: start}, async (err, event) => {
        const insert = new EventTransferVerified({
            block: event.blockNumber,
            hash: event.transactionHash,
            from: event.returnValues['0'],
            to: event.returnValues['1'],
            id: event.returnValues['2']
        });
        await insert.save();
        console.log(":: Transfer (Verified) [ " + event.transactionHash + " ]");
    });
}

async function synchronize_eventapprovalverified(infos) {
    const EventApprovalVerified = global.mongoose.EventApprovalVerified;
    const highest = await EventApprovalVerified.find({}, ['block'], {
        limit: 1,
        sort: {
            block: -1,
        }
    });
    const start = highest.length ? highest[0].block + 1 : infos.block_number;
    console.log(":: Fetching Event Approval (Verified) from block " + start);
    Ticket721Verified.events.Approval({fromBlock: start}, async (err, event) => {
        const insert = new EventApprovalVerified({
            block: event.blockNumber,
            hash: event.transactionHash,
            owner: event.returnValues['0'],
            approved: event.returnValues['1'],
            id: event.returnValues['2']
        });
        await insert.save();
        console.log(":: Approval (Verified) [ " + event.transactionHash + " ]");
    });
}

async function synchronize_eventapprovalforallverified(infos) {
    const EventApprovalForAllVerified = global.mongoose.EventApprovalForAllVerified;
    const highest = await EventApprovalForAllVerified.find({}, ['block'], {
        limit: 1,
        sort: {
            block: -1,
        }
    });
    const start = highest.length ? highest[0].block + 1 : infos.block_number;
    console.log(":: Fetching Event ApprovalForAll (Verified) from block " + start);
    Ticket721Verified.events.ApprovalForAll({fromBlock: start}, async (err, event) => {
        const insert = new EventApprovalForAllVerified({
            block: event.blockNumber,
            hash: event.transactionHash,
            owner: event.returnValues['0'],
            operator: event.returnValues['1'],
            approved: event.returnValues['2']
        });
        await insert.save();
        console.log(":: ApprovalForAll (Verified) [ " + event.transactionHash + " ]");
    });
}

async function synchronize_hubsale(infos) {
    const EventCreation = global.mongoose.EventCreation;
    await EventCreation.remove({});
    const highest = await EventCreation.find({}, ['block'], {
        limit: 1,
        sort: {
            block: -1,
        }
    });
    const start = highest.length ? highest[0].block + 1 : infos.block_number;
    console.log(":: Fetching Event Creation from block " + start);
    Ticket721Hub.events.Sale({fromBlock: start}, async (err, event) => {
        const insert = new EventCreation({
            block: event.blockNumber,
            hash: event.transactionHash,
            controller: event.returnValues['0'],
            owner: event.returnValues['1'],
        });
        await insert.save();
        fetch_event_infos(event.returnValues['0'], event.returnValues['1']);
        console.log(":: Event Creation [ " + event.transactionHash + " ]");
    });
}

async function fetch_event_infos(address, owner) {
    const EventListing = global.mongoose.EventListing;
    await EventListing.remove({});

    const instance = new web3.eth.Contract(Ticket721ControllerArtifact.abiDefinition, address);

    const event = new EventListing({
        address,
        name: await instance.methods.name().call(),
        infos: await instance.methods.getEventURI().call(),
        mint_price: await instance.methods.getMintPrice().call(),
        verified: await Ticket721VerifiedAccounts.methods.isValid(owner).call(),
        sale_end: await instance.methods.getSaleEnd().call(),
        event_begin: await instance.methods.getEventBegin().call(),
        event_end: await instance.methods.getEventEnd().call(),
        category: 'new'
    });

    await event.save();
    console.log(":: Registered " + (event.verified ? "Verified " : "") + "Event : " + event.name + " at " + address);
}


async function get_nft_ids(address) {
    const amount = await Ticket721.methods.balanceOf(address).call();
    const wallet = [];
    for (let idx = 0; idx < amount; ++idx) {
        wallet.push(parseInt(await Ticket721.methods.tokenOfOwnerByIndex(address, idx).call()));
    }
    return wallet;
}

async function get_verified_nft_ids(address) {
    const amount = await Ticket721Verified.methods.balanceOf(address).call();
    const wallet = [];
    for (let idx = 0; idx < amount; ++idx) {
        wallet.push(parseInt(await Ticket721Verified.methods.tokenOfOwnerByIndex(address, idx).call()));
    }
    return wallet;
}

const User = global.mongoose.User;

async function refresh_wallets(req, res, next) {
    try {
        if (!req.user) {
            res.status(500);
            res.send(JSON.stringify({
                error: 'Not logged in'
            }));
            return next();
        }
        const address = web3.utils.toChecksumAddress(req.user.address);
        User.findOne({address: address}, async (_err, _result) => {
            if (_err) {
                res.status(500);
                res.send(JSON.stringify({
                    error: "Internal Error"
                }));
                return next();
            }
            if (!_result) {
                res.status(500);
                res.send(JSON.stringify({
                    error: "Account not registered"
                }));
                return next();
            }
            const public_wallet = await get_nft_ids(address);
            const verified_wallet = await get_verified_nft_ids(address);
            _result.public_wallet = public_wallet;
            _result.verified_wallet = verified_wallet;
            await _result.save();
            res.redirect("/");
        })
    } catch (e) {
        res.status(500);
        res.send(JSON.stringify({
            error: "Internal Error"
        }));
        next();
    }
}

const EventListing = global.mongoose.EventListing;

async function get_events(req, res, next) {
    try {
        const events = (await EventListing.find({verified: true}))
            .map(event => {
                return {
                    address: event.address,
                    name: event.name,
                    mint_price: event.mint_price,
                    sale_end: event.sale_end,
                    event_begin: event.event_begin,
                    event_end: event.event_end,
                    category: event.category,
                    infos: event.infos
                }
            });

        res.status(200);
        res.json(events);
        next();
    } catch (e) {
        res.status(500);
        res.send(JSON.stringify({
            error: "Internal Error"
        }));
        next();
    }
}

async function eth_link(app, passport) {

    const hub_address = web3.utils.toChecksumAddress(process.env.T721H_ADDRESS);
    const binfos = global.mongoose.BlockchainInfos;
    const res = await binfos.find({hub_address: hub_address});
    let infos;
    if (!res.length) {
        console.log(":: No Blockchain informations found");
        const addresses = await get_addresses();

        await load_contracts(addresses[0], addresses[1], addresses[2]);

        const block_number = await get_creation_block();

        const Infos = new binfos({
            hub_address: hub_address,
            public_registry_address: addresses[1],
            verified_registry_address: addresses[0],
            verified_account_registry_address: addresses[2],
            block_number
        });
        infos = {
            hub_address: hub_address,
            public_registry_address: addresses[1],
            verified_registry_address: addresses[0],
            verified_account_registry_address: addresses[2],
            block_number
        };
        await Infos.save();
        console.log(":: Saved Blockchain informations");
    } else {
        infos = res[0];
        await load_contracts(infos.verified_registry_address, infos.public_registry_address, infos.verified_account_registry_address);
        console.log(":: Blockchain informations found");
    }

    synchronize_eventsaleverified(infos);
    synchronize_eventbuyverified(infos);
    synchronize_eventregisterverified(infos);
    synchronize_eventtransferverified(infos);
    synchronize_eventapprovalverified(infos);
    synchronize_eventapprovalforallverified(infos);
    synchronize_eventsale(infos);
    synchronize_eventbuy(infos);
    synchronize_eventregister(infos);
    synchronize_eventtransfer(infos);
    synchronize_eventapproval(infos);
    synchronize_eventapprovalforall(infos);
    synchronize_hubsale(infos);

    app.get('/refresh_wallets', passport.authenticate('jwt', {session: false}), refresh_wallets);
    app.get('/get_events', get_events);
}

module.exports = eth_link;

