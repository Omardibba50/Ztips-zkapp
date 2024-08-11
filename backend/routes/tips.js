const express = require('express');
const router = express.Router();
const { generateZKProof } = require('../utils/zkProofGenerator');

router.post('/submit', async (req, res) => {
  try {
    const { bountyId, content } = req.body;
    const proof = await generateZKProof('SUBMIT_TIP', { bountyId, content });
    const tx = await zTipsContract.submitTip(bountyId, content, proof);
    await tx.wait();
    res.json({ success: true, transactionHash: tx.hash });
  } catch (error) {
    res.status(400).json({ error: 'Tip submission failed' });
  }
});

module.exports = router;
