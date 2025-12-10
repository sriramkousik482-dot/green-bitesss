const Donation = require('../models/Donation');
const Request = require('../models/Request');
const User = require('../models/User');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const stats = {};

    if (req.user.role === 'admin' || req.user.role === 'analyst') {
      // Total counts
      stats.totalDonations = await Donation.countDocuments();
      stats.totalUsers = await User.countDocuments();
      stats.totalRequests = await Request.countDocuments();

      // Donations by status
      stats.donationsByStatus = await Donation.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      // Requests by status
      stats.requestsByStatus = await Request.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      // Users by role
      stats.usersByRole = await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]);

      // Total food saved (completed donations)
      const completedDonations = await Donation.find({ status: 'completed' });
      stats.totalFoodSaved = completedDonations.reduce((total, donation) => {
        return total + (donation.quantity?.amount || 0);
      }, 0);

      // Recent activity
      stats.recentDonations = await Donation.find()
        .sort('-createdAt')
        .limit(5)
        .populate('donor', 'fullName');

      stats.recentRequests = await Request.find()
        .sort('-createdAt')
        .limit(5)
        .populate('recipient', 'fullName');

    } else if (req.user.role === 'donor') {
      // Donor-specific stats
      stats.totalDonations = await Donation.countDocuments({ donor: req.user.id });
      stats.activeDonations = await Donation.countDocuments({ donor: req.user.id, status: 'available' });
      stats.completedDonations = await Donation.countDocuments({ donor: req.user.id, status: 'completed' });

      const myDonations = await Donation.find({ donor: req.user.id, status: 'completed' });
      stats.totalFoodDonated = myDonations.reduce((total, donation) => {
        return total + (donation.quantity?.amount || 0);
      }, 0);

      // Recent donations
      stats.recentDonations = await Donation.find({ donor: req.user.id })
        .sort('-createdAt')
        .limit(10);

    } else if (req.user.role === 'recipient') {
      // Recipient-specific stats
      stats.totalRequests = await Request.countDocuments({ recipient: req.user.id });
      stats.approvedRequests = await Request.countDocuments({ recipient: req.user.id, status: 'approved' });
      stats.completedRequests = await Request.countDocuments({ recipient: req.user.id, status: 'completed' });

      const myRequests = await Request.find({ recipient: req.user.id, status: 'completed' });
      stats.totalFoodReceived = myRequests.reduce((total, request) => {
        return total + (request.requestedQuantity?.amount || 0);
      }, 0);

      // Available donations
      stats.availableDonations = await Donation.countDocuments({ status: 'available' });

      // Recent requests
      stats.recentRequests = await Request.find({ recipient: req.user.id })
        .sort('-createdAt')
        .limit(10)
        .populate('donation', 'foodType quantity');
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get food waste analytics
// @route   GET /api/analytics/food-waste
// @access  Private (Admin/Analyst)
exports.getFoodWasteAnalytics = async (req, res) => {
  try {
    // Food saved by category
    const foodByCategory = await Donation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$quantity.amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    // Monthly trends
    const monthlyTrends = await Donation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: {
            year: { $year: '$completedAt' },
            month: { $month: '$completedAt' }
          },
          totalDonations: { $sum: 1 },
          totalAmount: { $sum: '$quantity.amount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    // City-wise distribution
    const cityDistribution = await Donation.aggregate([
      { $match: { status: { $in: ['completed', 'claimed'] } } },
      {
        $group: {
          _id: '$pickupLocation.city',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        foodByCategory,
        monthlyTrends,
        cityDistribution
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get impact metrics
// @route   GET /api/analytics/impact
// @access  Private (Admin/Analyst)
exports.getImpactMetrics = async (req, res) => {
  try {
    const completedDonations = await Donation.find({ status: 'completed' });

    const totalFoodSaved = completedDonations.reduce((total, donation) => {
      return total + (donation.quantity?.amount || 0);
    }, 0);

    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalRecipients = await User.countDocuments({ role: 'recipient' });

    // Estimated people fed (assuming 1 serving feeds 1 person)
    const peopleFed = completedDonations.reduce((total, donation) => {
      if (donation.quantity?.unit === 'servings') {
        return total + donation.quantity.amount;
      }
      return total + Math.floor(donation.quantity.amount / 0.5); // rough estimate
    }, 0);

    // CO2 emissions saved (rough estimate: 1kg food = 2.5kg CO2)
    const co2Saved = totalFoodSaved * 2.5;

    res.json({
      success: true,
      data: {
        totalFoodSaved: Math.round(totalFoodSaved),
        totalDonations: completedDonations.length,
        totalDonors,
        totalRecipients,
        estimatedPeopleFed: Math.round(peopleFed),
        estimatedCO2Saved: Math.round(co2Saved)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
