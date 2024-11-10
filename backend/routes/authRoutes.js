// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  const { name, surname, idNumber, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const newUser = new User({
      name,
      surname,
      idNumber, // Ensure idNumber is added here
      email,
      password: hashedPassword,
      role: 'user',
      accountNumber,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token, user: { id: newUser._id, name, role: 'user' } });
  } catch (error) {
    console.error('Error during registration:', error); // Detailed error logging
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
