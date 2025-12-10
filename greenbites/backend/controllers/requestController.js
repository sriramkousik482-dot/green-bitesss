const Request = require('../models/Request');
const Donation = require('../models/Donation');

// @desc    Create food request
// @route   POST /api/requests
// @access  Private (Recipient)
exports.createRequest = async (req, res) => {
  try {
    req.body.recipient = req.user.id;

    // Check if donation exists and is available
    const donation = await Donation.findById(req.body.donation);
    
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

    const request = await Request.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      data: request
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

// @desc    Get all requests
// @route   GET /api/requests
// @access  Private
exports.getRequests = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    // Filter based on user role
    if (req.user.role === 'recipient') {
      query.recipient = req.user.id;
    } else if (req.user.role === 'donor') {
      // Get requests for donor's donations
      const donations = await Donation.find({ donor: req.user.id }).select('_id');
      const donationIds = donations.map(d => d._id);
      query.donation = { $in: donationIds };
    }

    const requests = await Request.find(query)
      .populate('recipient', 'fullName email phone organization')
      .populate('donation', 'foodType quantity pickupLocation expiryDate')
      .populate('approvedBy', 'fullName')
      .sort('-createdAt');

    res.json({
      success: true,
      count: requests.length,
      data: requests
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

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
exports.getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('recipient', 'fullName email phone organization address')
      .populate('donation')
      .populate('approvedBy', 'fullName email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      data: request
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

// @desc    Update request
// @route   PUT /api/requests/:id
// @access  Private
exports.updateRequest = async (req, res) => {
  try {
    let request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check ownership
    if (request.recipient.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request'
      });
    }

    request = await Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Request updated successfully',
      data: request
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

// @desc    Approve request
// @route   PUT /api/requests/:id/approve
// @access  Private (Admin/Donor)
exports.approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('donation');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request is not pending'
      });
    }

    // Check if user is admin or donation owner
    if (req.user.role !== 'admin' && request.donation.donor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to approve this request'
      });
    }

    request.status = 'approved';
    request.approvedBy = req.user.id;
    request.approvedAt = Date.now();

    await request.save();

    // Update donation status
    const donation = await Donation.findById(request.donation._id);
    donation.status = 'claimed';
    donation.claimedBy = request.recipient;
    donation.claimedAt = Date.now();
    await donation.save();

    res.json({
      success: true,
      message: 'Request approved successfully',
      data: request
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

// @desc    Reject request
// @route   PUT /api/requests/:id/reject
// @access  Private (Admin/Donor)
exports.rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('donation');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request is not pending'
      });
    }

    // Check if user is admin or donation owner
    if (req.user.role !== 'admin' && request.donation.donor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this request'
      });
    }

    request.status = 'rejected';
    request.rejectedAt = Date.now();
    request.rejectionReason = req.body.reason || 'No reason provided';

    await request.save();

    res.json({
      success: true,
      message: 'Request rejected successfully',
      data: request
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

// @desc    Complete request
// @route   PUT /api/requests/:id/complete
// @access  Private
exports.completeRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    request.status = 'completed';
    request.completedAt = Date.now();

    await request.save();

    res.json({
      success: true,
      message: 'Request completed successfully',
      data: request
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

// @desc    Cancel request
// @route   DELETE /api/requests/:id
// @access  Private
exports.cancelRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check ownership
    if (request.recipient.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this request'
      });
    }

    request.status = 'cancelled';
    await request.save();

    res.json({
      success: true,
      message: 'Request cancelled successfully'
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
