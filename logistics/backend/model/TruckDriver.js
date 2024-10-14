import mongoose from 'mongoose';

const TruckDriverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  truckId: {
    type: String,
    required: true,
    unique: true, // Each truck has a unique ID
  },
  currentLocation: {
    type: {
      latitude: Number,
      longitude: Number,
    },
    default: { latitude: 0, longitude: 0 },
  },
  destination: {
    type: {
      latitude: Number,
      longitude: Number,
    },
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});


export default mongoose.model('TruckDriver', TruckDriverSchema);

