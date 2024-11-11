const express = require('express');
const Payment = require('../model/paymentModel');
const User = require('../model/userModel'); 
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to create a new payment request (single record)
// Route to create a new payment request (single record)
router.post('/', verifyToken, async (req, res) => {
  console.log('POST /api/payments - Payment creation route hit');

  const { recipientEmail, swiftCode, amount } = req.body;
  const senderId = req.user.id;

  try {
    console.log('Received payment data:', { senderId, recipientEmail, swiftCode, amount });

    // Verify that the recipient exists
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      console.log(`Recipient with email ${recipientEmail} not found`);
      return res.status(404).json({ message: 'Recipient not found' });
    }
    console.log('Recipient found:', recipient);

    // Create a single payment record with transaction type indicating the nature for each user
    const payment = new Payment({
      sender: senderId,
      recipient: recipient._id,
      swiftCode,
      amount,
      status: 'Pending',
      transactionType: 'outgoing', // Use 'outgoing' for sender and interpret it for recipient in frontend
    });

    await payment.save();
    console.log('Payment record created successfully:', payment);
    res.status(201).json({ message: 'Payment created successfully', payment });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Failed to create payment', error });
  }
});





// Route to get the user's payment history
router.get('/history', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    // Retrieve all transactions where the user is either the sender or recipient
    const payments = await Payment.find({
      $or: [{ sender: userId }, { recipient: userId }]
    })
      .populate('sender', 'name email accountNumber')
      .populate('recipient', 'name email accountNumber')
      .sort({ createdAt: -1 });

    // Add a `displayText` field based on the user's role in the transaction
    const modifiedPayments = payments.map((payment) => {
      // Determine if the user is the recipient (Money In) or the sender (Sent)
      if (payment.recipient._id.toString() === userId) {
        payment.displayText = `Money In from ${payment.sender.name}`;
        payment.transactionType = 'incoming'; // Mark as incoming if user is recipient
      } else {
        payment.displayText = `Sent to ${payment.recipient.name}`;
        payment.transactionType = 'outgoing'; // Mark as outgoing if user is sender
      }
      return payment;
    });

    res.status(200).json(modifiedPayments);
  } catch (error) {
    console.error('Error retrieving payment history:', error);
    res.status(500).json({ message: 'Failed to retrieve payment history', error });
  }
});







module.exports = router;
