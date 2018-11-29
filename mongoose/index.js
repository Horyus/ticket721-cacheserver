if (!global.mongoose) {
    const Mongoose = require('mongoose');
    const Web3Utils = require('web3-utils');
    const conn = Mongoose.createConnection(process.env.DB_URL || "mongodb://localhost:27017/ticket721", {useNewUrlParser: true});

    const Schema = Mongoose.Schema;

    const _User = new Schema({
        address: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        }
    });

    const _BlockchainInfos = new Schema({
        hub_address: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        public_registry_address: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        verified_registry_address: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        verified_account_registry_address: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        block_number: {
            type: Number
        }
    });

    const _EventMint = new Schema({
        block: Number,
        hash: String,
        owner: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        emitter: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        id: Number
    });

    const _EventSale = new Schema({
        block: Number,
        hash: String,
        owner: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        id: Number
    });

    const _EventCloseSale = new Schema({
        block: Number,
        hash: String,
        owner: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        id: Number
    });

    const _EventBuy = new Schema({
        block: Number,
        hash: String,
        buyer: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        id: Number
    });

    const _EventRegister = new Schema({
        block: Number,
        hash: String,
        controller: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        }
    });

    const _EventTransfer = new Schema({
        block: Number,
        hash: String,
        from: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        to: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        id: Number
    });

    const _EventApproval = new Schema({
        block: Number,
        hash: String,
        owner: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        approved: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        id: Number
    });

    const _EventApprovalForAll = new Schema({
        block: Number,
        hash: String,
        owner: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        operator: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        approved: Boolean
    });

    const _EventMintVerified = new Schema({
        block: Number,
        hash: String,
        owner: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        emitter: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        id: Number
    });

    const _EventSaleVerified = new Schema({
        block: Number,
        hash: String,
        owner: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        id: Number
    });

    const _EventCloseSaleVerified = new Schema({
        block: Number,
        hash: String,
        owner: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        id: Number
    });

    const _EventBuyVerified = new Schema({
        block: Number,
        hash: String,
        buyer: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        id: Number
    });

    const _EventRegisterVerified = new Schema({
        block: Number,
        hash: String,
        controller: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        }
    });

    const _EventTransferVerified = new Schema({
        block: Number,
        hash: String,
        from: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        to: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        id: Number
    });

    const _EventApprovalVerified = new Schema({
        block: Number,
        hash: String,
        owner: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        approved: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        id: Number
    });

    const _EventApprovalForAllVerified = new Schema({
        block: Number,
        hash: String,
        owner: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        operator: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        approved: Boolean
    });

    const _EventCreation = new Schema({
        block: Number,
        hash: String,
        controller: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        owner: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        }
    });

    const _EventListing = new Schema({
        address: {
            type: String,
            validate: {
                validator: (v) => {
                    return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                }
            }
        },
        infos: String,
        name: String,
        description: String,
        mint_price: String,
        verified: Boolean,
        sale_end: Number,
        event_begin: Number,
        event_end: Number,
        category: String,
    });

    const _VerifiedTicketLife = new Schema({
        id: Number,
        sold: Boolean,
        history: [{
            action: String,
            block: Number,
            owner: {
                type: String,
                validate: {
                    validator: (v) => {
                        return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                    }
                }
            }
        }]
    });

    const _TicketLife = new Schema({
        id: Number,
        sold: Boolean,
        history: [{
            action: String,
            block: Number,
            owner: {
                type: String,
                validate: {
                    validator: (v) => {
                        return (Web3Utils.isAddress(v) && Web3Utils.checkAddressChecksum(v));
                    }
                }
            }
        }]
    });

    const User = conn.model('User', _User);
    const BlockchainInfos = conn.model('BlockchainInfos', _BlockchainInfos);

    const EventMint = conn.model('EventMint', _EventMint);
    const EventSale = conn.model('EventSale', _EventSale);
    const EventCloseSale = conn.model('EventCloseSale', _EventCloseSale);
    const EventBuy = conn.model('EventBuy', _EventBuy);
    const EventRegister = conn.model('EventRegister', _EventRegister);
    const EventTransfer = conn.model('EventTransfer', _EventTransfer);
    const EventApproval = conn.model('EventApproval', _EventApproval);
    const EventApprovalForAll = conn.model('EventApprovalForAll', _EventApprovalForAll);

    const EventMintVerified = conn.model('EventMintVerified', _EventMintVerified);
    const EventSaleVerified = conn.model('EventSaleVerified', _EventSaleVerified);
    const EventCloseSaleVerified = conn.model('EventCloseSaleVerufued', _EventCloseSaleVerified);
    const EventBuyVerified = conn.model('EventBuyVerified', _EventBuyVerified);
    const EventRegisterVerified = conn.model('EventRegisterVerified', _EventRegisterVerified);
    const EventTransferVerified = conn.model('EventTransferVerified', _EventTransferVerified);
    const EventApprovalVerified = conn.model('EventApprovalVerified', _EventApprovalVerified);
    const EventApprovalForAllVerified = conn.model('EventApprovalForAllVerified', _EventApprovalForAllVerified);

    const EventCreation = conn.model('EventCreation', _EventCreation);
    const EventListing = conn.model('EventListing', _EventListing);

    const VerifiedTicketLife = conn.model('VerifiedTicketLife', _VerifiedTicketLife);
    const TicketLife = conn.model('TicketLife', _TicketLife);

    global.mongoose = {};
    global.mongoose.User = User;
    global.mongoose.BlockchainInfos = BlockchainInfos;
    global.mongoose.EventMint = EventMint;
    global.mongoose.EventSale = EventSale;
    global.mongoose.EventCloseSale = EventCloseSale;
    global.mongoose.EventBuy = EventBuy;
    global.mongoose.EventRegister = EventRegister;
    global.mongoose.EventTransfer = EventTransfer;
    global.mongoose.EventApproval = EventApproval;
    global.mongoose.EventApprovalForAll = EventApprovalForAll;
    global.mongoose.EventMintVerified = EventMintVerified;
    global.mongoose.EventSaleVerified = EventSaleVerified;
    global.mongoose.EventCloseSaleVerified = EventCloseSaleVerified;
    global.mongoose.EventBuyVerified = EventBuyVerified;
    global.mongoose.EventRegisterVerified = EventRegisterVerified;
    global.mongoose.EventTransferVerified = EventTransferVerified;
    global.mongoose.EventApprovalVerified = EventApprovalVerified;
    global.mongoose.EventApprovalForAllVerified = EventApprovalForAllVerified;
    global.mongoose.EventCreation = EventCreation;
    global.mongoose.EventListing = EventListing;
    global.mongoose.VerifiedTicketLife = VerifiedTicketLife;
    global.mongoose.TicketLife = TicketLife;
}

module.exports = {
    ...global.mongoose
};
