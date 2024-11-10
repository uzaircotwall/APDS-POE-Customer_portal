const express = require('express');
const User = require('../model/userModel');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to get user's balance and transaction history
router.get('/balance', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('balance transactions')
      .populate('transactions'); // Populating transactions

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      balance: user.balance,
      transactions: user.transactions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve balance and transactions', error });
  }
});

module.exports = router;
