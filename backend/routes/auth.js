const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ethers = require('ethers');

router.post('/register', async (req, res) => {
  try {
    const { address, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate a simple proof hash
    const proofHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['address', 'string'],
        [address, hashedPassword]
      )
    );
    
    // Store user in database with proof hash (implement your database logic here)
    // For example:
    // await db.users.insert({ address, hashedPassword, proofHash });

    const token = jwt.sign({ address }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, proofHash });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { address, password } = req.body;
    
    // Retrieve user from database (implement your database logic here)
    // For example:
    // const user = await db.users.findOne({ address });
    // if (!user) {
    //   return res.status(401).json({ error: 'Authentication failed' });
    // }
    
    // const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
    // if (!isValidPassword) {
    //   return res.status(401).json({ error: 'Authentication failed' });
    // }
    
    const token = jwt.sign({ address }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

module.exports = router;