const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User'); // Import the User model
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing and comparison
require('dotenv').config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000;

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
    const user = await User.findOne({ username: { $regex: new RegExp('^' + username + '$', 'i') } });
    console.log('User found:', user);

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if the password is hashed or plaintext
    let isPasswordValid;

    // Determine if the password is hashed (starts with $2b$)
    if (user.password.startsWith('$2b$')) {
      // Compare the provided password with the hashed password
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // For plaintext password
      isPasswordValid = password === user.password;
    }

    // Validate role and password
    if (isPasswordValid && user.role.toLowerCase() === role.toLowerCase()) {
      return res.status(200).json({
        message: 'Login successful',
        role: user.role,
        token: 'fake-jwt-token' // Assuming JWT integration in the future
      });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
