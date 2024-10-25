import mongoose from 'mongoose';

const PrivatePartnerSchema = new mongoose.Schema({
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
  company: {
    type: String,
    required: true,
  },
  servicesOffered: {
    type: [String], // Example: ['Logistics', 'Warehousing']
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('PrivatePartner', PrivatePartnerSchema);

