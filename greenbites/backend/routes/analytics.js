const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getFoodWasteAnalytics,
  getImpactMetrics
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboardAnalytics);
router.get('/food-waste', protect, authorize('admin', 'analyst'), getFoodWasteAnalytics);
router.get('/impact', protect, authorize('admin', 'analyst'), getImpactMetrics);

module.exports = router;
