const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId, // Stores recipient's ObjectId
    ref: 'User',
    required: true,
  },
  swiftCode: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  transactionType: {
    type: String,
    enum: ['incoming', 'outgoing', 'completed'], // Added 'completed' as a valid enum value
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
