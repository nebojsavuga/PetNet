const { PinataSDK } = require("pinata");

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.PINATA_API_URL,
});

module.exports = { pinata };