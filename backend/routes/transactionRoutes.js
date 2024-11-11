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
    // Find the recipient based on account number
    const recipient = await User.findOne({ accountNumber: recipientAccountNumber });
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Create a pending transaction entry for approval
    const newTransaction = new Transaction({
      senderId,
      recipientAccountNumber,
      swiftCode,
      amount,
      currency,
      status: 'Pending',
      transactionType: 'outgoing' // Default to 'outgoing' for the sender
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

    // Deduct amount from sender's balance and add to recipient's balance
    sender.balance -= transaction.amount;
    recipient.balance += transaction.amount;

    // Mark the original transaction as approved for the sender
    transaction.status = 'Approved';
    transaction.transactionType = 'outgoing'; // Explicitly set as 'outgoing' for the sender

    // Create a separate incoming transaction for the recipient
    const recipientTransaction = new Transaction({
      senderId: transaction.senderId,
      recipientAccountNumber: transaction.recipientAccountNumber,
      swiftCode: transaction.swiftCode,
      amount: transaction.amount,
      currency: transaction.currency,
      status: 'Approved',
      transactionType: 'incoming', // Set as 'incoming' for the recipient
      createdAt: transaction.createdAt
    });

    await sender.save();
    await recipient.save();
    await transaction.save();
    await recipientTransaction.save();

    res.status(200).json({ message: 'Transaction approved', transaction, recipientTransaction });
  } catch (error) {
    console.error('Error approving transaction:', error);
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
