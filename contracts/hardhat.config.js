require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const POLYGON_AMOY_RPC_URL = process.env.POLYGON_AMOY_RPC_URL;

if (!PRIVATE_KEY || !POLYGON_AMOY_RPC_URL) {
  console.error("Please set your PRIVATE_KEY and POLYGON_AMOY_RPC_URL in a .env file");
  process.exit(1);
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.10",
  defaultNetwork: "polygon_amoy",
  networks: {
    hardhat: {},
    polygon_amoy: {
      url: POLYGON_AMOY_RPC_URL,
      chainId: 80002,
      accounts: [`0x${PRIVATE_KEY}`],
      gasPrice: 30000000000, // 30 gwei
      gas: 2100000,
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};