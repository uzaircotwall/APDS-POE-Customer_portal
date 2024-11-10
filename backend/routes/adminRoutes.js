const express = require('express');
const Payment = require('../model/paymentModel');
const User = require('../model/userModel');
const bcrypt = require('bcryptjs');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Middleware to check if user is an admin
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// Route to get all pending payments (for admins) with populated sender and recipient details
router.get('/payments', verifyToken, verifyAdmin, async (req, res) => {
  try {
    // Fetch all pending payments and populate sender and recipient details
    const payments = await Payment.find({ status: 'Pending' })
      .populate('sender', 'name email accountNumber')
      .populate('recipient', 'name email accountNumber');

    console.log('Fetched pending payments with populated details:', payments);
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error retrieving pending payments:', error);
    res.status(500).json({ message: 'Failed to retrieve payments', error });
  }
});

// Route to approve a payment
router.post('/payments/:id/approve', verifyToken, verifyAdmin, async (req, res) => {
  console.log('Approving payment with ID:', req.params.id);

  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment || payment.status !== 'Pending') {
      console.log('Payment not found or already processed:', payment);
      return res.status(404).json({ message: 'Payment not found or already processed' });
    }

    const sender = await User.findById(payment.sender);
    const recipient = await User.findById(payment.recipient);

    if (!sender || !recipient) {
      console.log('Sender or recipient not found');
      return res.status(400).json({ message: 'Sender or recipient not found' });
    }

    if (sender.balance < payment.amount) {
      console.log('Insufficient balance for sender:', sender.balance, 'Required:', payment.amount);
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct amount from sender and credit to recipient
    sender.balance -= payment.amount;
    recipient.balance += payment.amount;
    await sender.save();
    await recipient.save();

    // Update the payment record to reflect a completed transaction
    payment.status = 'Approved';
    payment.transactionType = 'completed';
    await payment.save();

    console.log('Payment approved and processed successfully:', payment);
    res.status(200).json({ message: 'Payment approved and processed', payment });
  } catch (error) {
    console.error('Error approving payment:', error);
    res.status(500).json({ message: 'Failed to approve payment', error });
  }
});

// Route to reject a payment
router.post('/payments/:id/reject', verifyToken, verifyAdmin, async (req, res) => {
  console.log('Rejecting payment with ID:', req.params.id);

  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment || payment.status !== 'Pending') {
      console.log('Payment not found or already processed:', payment);
      return res.status(404).json({ message: 'Payment not found or already processed' });
    }

    // Update payment status to Rejected
    payment.status = 'Rejected';
    await payment.save();

    console.log('Payment rejected successfully:', payment);
    res.status(200).json({ message: 'Payment rejected', payment });
  } catch (error) {
    console.error('Error rejecting payment:', error);
    res.status(500).json({ message: 'Failed to reject payment', error });
  }
});

// Route to add a new admin
router.post('/add-admin', verifyToken, verifyAdmin, async (req, res) => {
  const { name, surname, email, password, idNumber } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique 10-digit account number for the admin
    let accountNumber;
    let isUnique = false;
    while (!isUnique) {
      accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      isUnique = !(await User.findOne({ accountNumber }));
    }

    const newAdmin = new User({
      name,
      surname,
      email,
      password: hashedPassword,
      idNumber,
      role: 'admin',
      accountNumber,
      balance: 0
    });

    await newAdmin.save();

    console.log('New admin added successfully:', newAdmin);
    res.status(201).json({ message: 'New admin added successfully', admin: newAdmin });
  } catch (error) {
    console.error('Error adding new admin:', error);
    res.status(500).json({ message: 'Failed to add admin', error });
  }
});

module.exports = router;
