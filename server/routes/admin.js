const express = require('express');
const { body, validationResult } = require('express-validator');
const Request = require('../models/Request');
const User = require('../models/User');
const { adminAuth } = require('../middleware/auth');
const { sendPickupNotification } = require('../config/email');

const router = express.Router();

// Get all requests
router.get('/requests', adminAuth, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const requests = await Request.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone address');

    res.json({ requests });
  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({ message: 'Server error fetching requests' });
  }
});

// Get request statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: 'Pending' });
    const approvedRequests = await Request.countDocuments({ status: 'Approved' });
    const scheduledRequests = await Request.countDocuments({ status: 'Scheduled' });
    const completedRequests = await Request.countDocuments({ status: 'Completed' });
    const totalUsers = await User.countDocuments({ role: 'user' });

    res.json({
      stats: {
        totalRequests,
        pendingRequests,
        approvedRequests,
        scheduledRequests,
        completedRequests,
        totalUsers
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error fetching statistics' });
  }
});

// Update request status
router.patch('/requests/:id/status', adminAuth, [
  body('status').isIn(['Pending', 'Approved', 'Scheduled', 'Completed', 'Cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, adminNotes } = req.body;
    const request = await Request.findById(req.params.id).populate('user');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    if (adminNotes) {
      request.adminNotes = adminNotes;
    }

    await request.save();

    res.json({ message: 'Request status updated', request });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error updating status' });
  }
});

// Schedule pickup
router.patch('/requests/:id/schedule', adminAuth, [
  body('pickupDate').isISO8601().withMessage('Valid pickup date is required'),
  body('assignedPersonnel').trim().notEmpty().withMessage('Assigned personnel is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { pickupDate, assignedPersonnel, adminNotes } = req.body;
    const request = await Request.findById(req.params.id).populate('user');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'Scheduled';
    request.pickupDate = pickupDate;
    request.assignedPersonnel = assignedPersonnel;
    if (adminNotes) {
      request.adminNotes = adminNotes;
    }

    await request.save();

    // Send email notification
    try {
      await sendPickupNotification(
        request.user.email,
        request.user.name,
        {
          deviceName: request.deviceName,
          deviceCategory: request.deviceCategory,
          condition: request.condition,
          pickupDate: request.pickupDate,
          assignedPersonnel: request.assignedPersonnel
        }
      );
    } catch (emailError) {
      console.error('Email notification error:', emailError);
      // Don't fail the request if email fails
    }

    res.json({ message: 'Pickup scheduled successfully', request });
  } catch (error) {
    console.error('Schedule pickup error:', error);
    res.status(500).json({ message: 'Server error scheduling pickup' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

module.exports = router;

