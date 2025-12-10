const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createDonation,
  getDonations,
  getDonation,
  updateDonation,
  deleteDonation,
  claimDonation,
  completeDonation
} = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validate');

// Validation rules
const donationValidation = [
  body('foodType').notEmpty().withMessage('Food type is required'),
  body('category').isIn(['Fruits', 'Vegetables', 'Grains', 'Dairy', 'Meat', 'Prepared Food', 'Baked Goods', 'Other']).withMessage('Invalid category'),
  body('quantity.amount').isNumeric().withMessage('Quantity amount must be a number'),
  body('quantity.unit').isIn(['kg', 'lbs', 'servings', 'items', 'liters']).withMessage('Invalid unit'),
  body('expiryDate').isISO8601().withMessage('Invalid expiry date'),
  body('pickupLocation.address').notEmpty().withMessage('Pickup address is required'),
  body('pickupLocation.city').notEmpty().withMessage('City is required'),
  body('pickupTime.from').isISO8601().withMessage('Invalid pickup start time'),
  body('pickupTime.to').isISO8601().withMessage('Invalid pickup end time')
];

// Routes
router.post('/', protect, authorize('donor', 'admin'), donationValidation, validateRequest, createDonation);
router.get('/', protect, getDonations);
router.get('/:id', protect, getDonation);
router.put('/:id', protect, updateDonation);
router.delete('/:id', protect, deleteDonation);
router.put('/:id/claim', protect, authorize('recipient', 'admin'), claimDonation);
router.put('/:id/complete', protect, completeDonation);

module.exports = router;
