const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodType: {
    type: String,
    required: [true, 'Please specify food type'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Fruits', 'Vegetables', 'Grains', 'Dairy', 'Meat', 'Prepared Food', 'Baked Goods', 'Other'],
    required: true
  },
  quantity: {
    amount: {
      type: Number,
      required: [true, 'Please specify quantity']
    },
    unit: {
      type: String,
      enum: ['kg', 'lbs', 'servings', 'items', 'liters'],
      required: true
    }
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please specify expiry date']
  },
  pickupLocation: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  pickupTime: {
    from: {
      type: Date,
      required: true
    },
    to: {
      type: Date,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['available', 'claimed', 'completed', 'expired', 'cancelled'],
    default: 'available'
  },
  description: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  claimedAt: Date,
  completedAt: Date,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String
}, {
  timestamps: true
});

// Index for efficient queries
donationSchema.index({ donor: 1, status: 1 });
donationSchema.index({ expiryDate: 1 });
// donationSchema.index({ 'pickupLocation.coordinates': '2dsphere' });

module.exports = mongoose.model('Donation', donationSchema);
