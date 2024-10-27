// models/User.js

const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'privatePartner', 'truckDriver', 'Manager'],
    required: true,
  }
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
