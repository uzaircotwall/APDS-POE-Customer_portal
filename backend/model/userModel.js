const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  surname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  accountNumber: {
    type: String,
    unique: true,
    required: true,
  },
  idNumber: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  balance: {
    type: Number,
    default: 10000, // Initialize balance to a default value for new users
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction', // Reference to a Transaction model
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
