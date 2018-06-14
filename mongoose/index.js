if (!global.mongoose) {
    const Mongoose = require('mongoose');
    const Web3Utils = require('web3-utils');
    const conn = Mongoose.createConnection(process.env.DB_URL || "mongodb://localhost/ticket721");

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

    const User = conn.model('User', _User);

    global.mongoose = User;
}

module.exports = {
    User: global.mongoose
};
