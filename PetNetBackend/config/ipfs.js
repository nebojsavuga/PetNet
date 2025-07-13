const { create } = require('ipfs-http-client');
require('dotenv').config();

const ipfs = create({
    host: process.env.IPFS_HOST,
    port: process.env.IPFS_PORT,
    protocol: 'https',
    headers: {
        authorization: `Basic ${Buffer.from(
            `${process.env.INFURA_PROJECT_ID}:${process.env.INFURA_PROJECT_SECRET}`
        ).toString('base64')}`,
    }
});

module.exports = ipfs;