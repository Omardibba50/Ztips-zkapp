const express = require('express');
const router = express.Router();
const ethers = require('ethers');
const { generateZKProof } = require('../utils/zkProofGenerator');

router.post('/create', async (req, res) => {
  try {
    const { title, description, amount } = req.body;
    const proof = await generateZKProof('CREATE_BOUNTY', { title, description, amount });
    const tx = await zTipsContract.createBounty(amount, title, description, proof);
    await tx.wait();
    res.json({ success: true, transactionHash: tx.hash });
  } catch (error) {
    res.status(400).json({ error: 'Bounty creation failed' });
  }
});

router.get('/', async (req, res) => {
  try {
    const bountyCount = await zTipsContract.nextBountyId();
    const bounties = [];
    for (let i = 0; i < bountyCount; i++) {
      const bounty = await zTipsContract.getBountyDetails(i);
      bounties.push({
        id: i,
        seeker: bounty.seeker,
        amount: ethers.utils.formatEther(bounty.amount),
        isActive: bounty.isActive,
        title: bounty.title,
        description: bounty.description
      });
    }
    res.json(bounties);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch bounties' });
  }
});

module.exports = router;
