// routes/transactionRoutes.js
const express = require('express');
const Transaction = require('../model/transactionModel');
const User = require('../model/userModel');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Route for customers to create a new transaction
router.post('/create', verifyToken, async (req, res) => {
  const { recipientAccountNumber, swiftCode, amount, currency } = req.body;
  const senderId = req.user.id; // User ID from the token

  try {
    // Create a new transaction
    const newTransaction = new Transaction({
      senderId,
      recipientAccountNumber,
      swiftCode,
      amount,
      currency
    });
    
    await newTransaction.save();

    res.status(201).json({ message: 'Transaction created successfully', transaction: newTransaction });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create transaction', error });
  }
});

// Route for admins to view all pending transactions
router.get('/pending', verifyToken, async (req, res) => {
  try {
    const pendingTransactions = await Transaction.find({ status: 'Pending' });
    res.status(200).json(pendingTransactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve pending transactions', error });
  }
});

// Route for admins to approve a transaction
router.post('/:id/approve', verifyToken, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction || transaction.status !== 'Pending') {
      return res.status(404).json({ message: 'Transaction not found or already processed' });
    }

    const sender = await User.findById(transaction.senderId);
    const recipient = await User.findOne({ accountNumber: transaction.recipientAccountNumber });

    if (!sender || !recipient) {
      return res.status(400).json({ message: 'Sender or recipient not found' });
    }

    if (sender.balance < transaction.amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    sender.balance -= transaction.amount;
    recipient.balance += transaction.amount;
    transaction.status = 'Approved';

    await sender.save();
    await recipient.save();
    await transaction.save();

    res.status(200).json({ message: 'Transaction approved', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve transaction', error });
  }
});

// Route for admins to reject a transaction
router.post('/:id/reject', verifyToken, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction || transaction.status !== 'Pending') {
      return res.status(404).json({ message: 'Transaction not found or already processed' });
    }

    transaction.status = 'Rejected';
    await transaction.save();

    res.status(200).json({ message: 'Transaction rejected', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject transaction', error });
  }
});

module.exports = router;
