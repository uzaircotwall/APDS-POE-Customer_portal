const express = require('express');
const Payment = require('../model/paymentModel');
const User = require('../model/userModel'); 
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to create a new payment request (single record for outgoing and incoming)
router.post('/', verifyToken, async (req, res) => {
  console.log('POST /api/payments - Payment creation route hit');

  const { recipientEmail, swiftCode, amount } = req.body;
  const senderId = req.user.id;

  try {
    console.log('Received payment data:', { senderId, recipientEmail, swiftCode, amount });

    // Verify recipient exists
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      console.log(`Recipient with email ${recipientEmail} not found`);
      return res.status(404).json({ message: 'Recipient not found' });
    }
    console.log('Recipient found:', recipient);

    // Create a single payment record for both sender and recipient
    const payment = new Payment({
      sender: senderId,
      recipient: recipient._id,
      swiftCode,
      amount,
      status: 'Pending',
      transactionType: 'outgoing'  // Initial state as outgoing, updated on approval
    });
    await payment.save();

    console.log('Payment record created successfully:', payment);
    res.status(201).json({ message: 'Payment created successfully', payment });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Failed to create payment', error });
  }
});

// Route to get customer's payment history
router.get('/history', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    // Retrieve all transactions where the user is either the sender or recipient
    const payments = await Payment.find({
      $or: [{ sender: userId }, { recipient: userId }]
    })
      .populate('sender', 'name email accountNumber')       // Populate sender's name, email, and accountNumber
      .populate('recipient', 'name email accountNumber')    // Populate recipient's name, email, and accountNumber
      .sort({ createdAt: -1 });                            // Sort by latest first

    res.status(200).json(payments);
  } catch (error) {
    console.error('Error retrieving payment history:', error);
    res.status(500).json({ message: 'Failed to retrieve payment history', error });
  }
});

module.exports = router;
