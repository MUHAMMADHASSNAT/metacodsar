const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/team
// @desc    Get all team members
// @access  Public
router.get('/', async (req, res) => {
  try {
    const teamMembers = await User.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(teamMembers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/team/:id
// @desc    Get single team member
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const teamMember = await User.findById(req.params.id).select('-password');

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json(teamMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/team
// @desc    Add new team member (admin only)
// @access  Private
router.post('/', auth, [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('designation').trim().isLength({ min: 2 }).withMessage('Designation must be at least 2 characters'),
  body('phone').optional().trim(),
  body('role').optional().isIn(['admin', 'user'])
], async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, designation, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const teamMember = new User({
      name,
      email,
      password,
      designation,
      phone,
      role: role || 'user'
    });

    await teamMember.save();

    res.status(201).json({
      message: 'Team member added successfully',
      teamMember: {
        _id: teamMember._id,
        name: teamMember.name,
        email: teamMember.email,
        designation: teamMember.designation,
        role: teamMember.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/team/:id
// @desc    Update team member (admin only)
// @access  Private
router.put('/:id', auth, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('designation').optional().trim().isLength({ min: 2 }),
  body('phone').optional().trim(),
  body('role').optional().isIn(['admin', 'user']),
  body('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const teamMember = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json({ message: 'Team member updated successfully', teamMember });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/team/:id
// @desc    Delete team member (admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Don't allow deleting own account
    if (req.params.id === req.userId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const teamMember = await User.findByIdAndDelete(req.params.id);

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
