const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceName: {
    type: String,
    required: true,
    trim: true
  },
  deviceCategory: {
    type: String,
    required: true,
    enum: ['Mobile', 'Laptop', 'Desktop', 'Tablet', 'TV', 'Monitor', 'Other']
  },
  condition: {
    type: String,
    required: true,
    enum: ['Working', 'Damaged', 'Dead']
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Scheduled', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  pickupDate: {
    type: Date
  },
  assignedPersonnel: {
    type: String,
    trim: true
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Request', requestSchema);

