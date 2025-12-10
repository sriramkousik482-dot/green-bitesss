const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createRequest,
  getRequests,
  getRequest,
  updateRequest,
  approveRequest,
  rejectRequest,
  completeRequest,
  cancelRequest
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validate');

// Validation rules
const requestValidation = [
  body('donation').notEmpty().withMessage('Donation ID is required'),
  body('requestedQuantity.amount').isNumeric().withMessage('Quantity must be a number'),
  body('deliveryMethod').isIn(['pickup', 'delivery']).withMessage('Invalid delivery method')
];

// Routes
router.post('/', protect, authorize('recipient', 'admin'), requestValidation, validateRequest, createRequest);
router.get('/', protect, getRequests);
router.get('/:id', protect, getRequest);
router.put('/:id', protect, updateRequest);
router.put('/:id/approve', protect, authorize('admin', 'donor'), approveRequest);
router.put('/:id/reject', protect, authorize('admin', 'donor'), rejectRequest);
router.put('/:id/complete', protect, completeRequest);
router.delete('/:id', protect, cancelRequest);

module.exports = router;
