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

// Create and export the User model, specifying the collection name as 'login--page'
const User = mongoose.model('User', userSchema, 'login---page');

module.exports = User;
