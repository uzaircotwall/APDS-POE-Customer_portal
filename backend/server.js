// server.js
const https = require('https');
const fs = require('fs');
const express = require('express');
const connectDB = require('./config/db.js');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const User = require('./model/userModel'); 

dotenv.config();
connectDB();

async function createDefaultAdmin() {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = new User({
        name: 'Admin',
        surname: 'User', // Default surname
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        accountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(), // Generates a random 10-digit account number
        idNumber: '0000000000000', // Provide a default idNumber
      });
      await adminUser.save();
      console.log('Default admin user created with email: admin@example.com and password: admin123');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating default admin user:', error);
  }
}



// Call the function to create a default admin user
createDefaultAdmin();

const app = express();

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.protocol === 'http') {
    res.redirect(`https://${req.headers.host}${req.url}`);
  } else {
    next();
  }
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'https://localhost:3000', // React app URL
  credentials: true,
}));
app.use(morgan('dev')); // Log all requests to the console
app.use(helmet()); // Use Helmet to set secure HTTP headers

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

// 404 Route Not Found
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// General Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

// SSL Options
const sslOptions = {
  key: fs.readFileSync('keys/localhost+2-key.pem'), // Update path to match where you saved the key
  cert: fs.readFileSync('keys/localhost+2.pem') // Update path to match where you saved the cert
};

// Start HTTPS Server
const PORT = process.env.PORT || 5000;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Secure HTTPS server running on port ${PORT}`);
});
