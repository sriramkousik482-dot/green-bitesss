const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: true
  },
  requestedQuantity: {
    amount: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    trim: true
  },
  deliveryMethod: {
    type: String,
    enum: ['pickup', 'delivery'],
    required: true
  },
  deliveryAddress: {
    address: String,
    city: String,
    state: String,
    zipCode: String
  },
  preferredPickupTime: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectedAt: Date,
  rejectionReason: String,
  completedAt: Date
}, {
  timestamps: true
});

// Index for efficient queries
requestSchema.index({ recipient: 1, status: 1 });
requestSchema.index({ donation: 1, status: 1 });

module.exports = mongoose.model('Request', requestSchema);
