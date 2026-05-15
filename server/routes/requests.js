const express = require('express');
const { body, validationResult } = require('express-validator');
const Request = require('../models/Request');
const { auth } = require('../middleware/auth');
const upload = require('../config/multer');

const router = express.Router();

// Create pickup request
router.post('/', auth, upload.array('images', 5), [
  body('deviceName').trim().notEmpty().withMessage('Device name is required'),
  body('deviceCategory').isIn(['Mobile', 'Laptop', 'Desktop', 'Tablet', 'TV', 'Monitor', 'Other']).withMessage('Invalid device category'),
  body('condition').isIn(['Working', 'Damaged', 'Dead']).withMessage('Invalid condition'),
  body('description').trim().notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const { deviceName, deviceCategory, condition, description } = req.body;
    const images = req.files.map(file => `/uploads/${file.filename}`);

    const request = new Request({
      user: req.user._id,
      deviceName,
      deviceCategory,
      condition,
      description,
      images,
      status: 'Pending'
    });

    await request.save();
    await request.populate('user', 'name email phone address');

    res.status(201).json({ message: 'Request created successfully', request });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Server error creating request' });
  }
});

// Get user's requests
router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = await Request.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone address');

    res.json({ requests });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ message: 'Server error fetching requests' });
  }
});

// Get single request
router.get('/:id', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('user', 'name email phone address');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user owns the request or is admin
    if (request.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ request });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ message: 'Server error fetching request' });
  }
});

module.exports = router;

