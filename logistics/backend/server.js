const express = require('express');
const connectDB = require('./config/config');
const Item = require('./models/item');
require('dotenv').config();

const app = express();
connectDB();

// Route to retrieve all items from the MongoDB collection
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find(); // Fetches all documents in the 'items' collection
    res.json(items);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
