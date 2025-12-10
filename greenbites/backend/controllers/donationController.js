const Donation = require('../models/Donation');
const User = require('../models/User');

// @desc    Create new donation
// @route   POST /api/donations
// @access  Private (Donor)
exports.createDonation = async (req, res) => {
  try {
    req.body.donor = req.user.id;

    const donation = await Donation.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Donation created successfully',
      data: donation
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

// @desc    Get all donations
// @route   GET /api/donations
// @access  Private
exports.getDonations = async (req, res) => {
  try {
    const { status, category, city } = req.query;
    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by city
    if (city) {
      query['pickupLocation.city'] = new RegExp(city, 'i');
    }

    // If donor, show only their donations
    if (req.user.role === 'donor') {
      query.donor = req.user.id;
    }

    const donations = await Donation.find(query)
      .populate('donor', 'fullName email phone organization')
      .populate('claimedBy', 'fullName email phone')
      .sort('-createdAt');

    res.json({
      success: true,
      count: donations.length,
      data: donations
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

// @desc    Get single donation
// @route   GET /api/donations/:id
// @access  Private
exports.getDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'fullName email phone address organization')
      .populate('claimedBy', 'fullName email phone');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    res.json({
      success: true,
      data: donation
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

// @desc    Update donation
// @route   PUT /api/donations/:id
// @access  Private (Donor/Admin)
exports.updateDonation = async (req, res) => {
  try {
    let donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Check ownership
    if (donation.donor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this donation'
      });
    }

    donation = await Donation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Donation updated successfully',
      data: donation
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

// @desc    Delete donation
// @route   DELETE /api/donations/:id
// @access  Private (Donor/Admin)
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Check ownership
    if (donation.donor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this donation'
      });
    }

    await donation.deleteOne();

    res.json({
      success: true,
      message: 'Donation deleted successfully'
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

// @desc    Claim donation
// @route   PUT /api/donations/:id/claim
// @access  Private (Recipient)
exports.claimDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    if (donation.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Donation is not available'
      });
    }

    donation.status = 'claimed';
    donation.claimedBy = req.user.id;
    donation.claimedAt = Date.now();

    await donation.save();

    res.json({
      success: true,
      message: 'Donation claimed successfully',
      data: donation
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

// @desc    Complete donation
// @route   PUT /api/donations/:id/complete
// @access  Private (Donor/Recipient/Admin)
exports.completeDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    donation.status = 'completed';
    donation.completedAt = Date.now();
    
    if (req.body.rating) {
      donation.rating = req.body.rating;
    }
    if (req.body.feedback) {
      donation.feedback = req.body.feedback;
    }

    await donation.save();

    res.json({
      success: true,
      message: 'Donation completed successfully',
      data: donation
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
