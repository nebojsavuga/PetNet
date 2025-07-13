const { create } = require('ipfs-http-client');
require('dotenv').config();

const projectId = process.env.INFURA_PROJECT_ID;
const projectSecret = process.env.INFURA_PROJECT_SECRET;
const auth = Buffer.from(`${projectId}:${projectSecret}`).toString('base64');
const ipfs = create({
    host: process.env.IPFS_HOST || 'ipfs.infura.io',
    port: process.env.IPFS_PORT || 5001,
    protocol: 'https',
    headers: {
        authorization: `Basic ${auth}`
    },
});

module.exports = ipfs;