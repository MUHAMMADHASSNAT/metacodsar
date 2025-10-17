const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get all team members
router.get('/', async (req, res) => {
  try {
    const teamMembers = await User.find({ isActive: true, role: { $ne: 'admin' } });
    res.json(teamMembers);
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;