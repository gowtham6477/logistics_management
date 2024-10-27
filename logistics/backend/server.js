const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User'); // Import the User model
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing and comparison
require('dotenv').config(); // Load environment variables from .env

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// MongoDB connection using the environment variable from .env
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully...');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Example login route using User model
app.post('/api/login', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Fetch the user from the database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if the password is hashed or plaintext
    const isPasswordValid = user.password.startsWith('$2b$') // Assuming bcrypt hashes start with $2b$
      ? await bcrypt.compare(password, user.password) // For hashed passwords
      : password === user.password; // For plaintext passwords

    if (isPasswordValid && user.role === role) {
      res.status(200).json({ message: 'Login successful', role: user.role });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
