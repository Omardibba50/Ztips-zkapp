const express = require('express');
const cors = require('cors');
const ethers = require('ethers');
const { prove } = require('./wasm/ztips_core.js'); // Use the exported prove function
const { verifyProof } = require('./zkVerifier');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_AMOY_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const ZTipsABI = require('./ZTipsABI.json');
const ZTipsTokenABI = require('./ZTipsTokenABI.json');

const zTipsContract = new ethers.Contract(process.env.ZTIPS_CONTRACT_ADDRESS, ZTipsABI, wallet);
const zTipsTokenContract = new ethers.Contract(process.env.ZTIPS_TOKEN_ADDRESS, ZTipsTokenABI, wallet);

const authRoutes = require('./routes/auth');
const tipsRoutes = require('./routes/tips');
const bountiesRoutes = require('./routes/bounties');

app.use('/api/auth', authRoutes);
app.use('/api/tips', tipsRoutes);
app.use('/api/bounties', bountiesRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));