const express = require('express');
const User = require('../model/userModel');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to get user's balance, account number, and transaction history
router.get('/balance', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('balance transactions accountNumber') // Select balance, transactions, and account number
      .populate('transactions'); // Populate transactions

    console.log("Fetched user data:", user);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      balance: user.balance,
      accountNumber: user.accountNumber, 
      transactions: user.transactions,
    });
  } catch (error) {
    console.error('Error fetching balance and transactions:', error);
    res.status(500).json({ message: 'Failed to retrieve balance and transactions', error });
  }
});

// New route to get user profile information
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name surname email accountNumber');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      name: user.name,
      surname: user.surname,
      email: user.email,
      accountNumber: user.accountNumber,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to retrieve user profile', error });
  }
});

module.exports = router;
