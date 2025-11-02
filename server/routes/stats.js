const express = require('express');
const jwt = require('jsonwebtoken');
const Stats = require('../models/Stats');

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get all stats (public)
router.get('/', async (req, res) => {
  try {
    const stats = await Stats.find().sort({ createdAt: -1 });
    
    // If no stats exist, return default stats
    if (stats.length === 0) {
      return res.json({
        stats: [
          { label: 'Projects Completed', value: 50, suffix: '+', color: 'from-emerald-500 to-green-600' },
          { label: 'Happy Clients', value: 25, suffix: '+', color: 'from-green-500 to-emerald-600' },
          { label: 'Years Experience', value: 5, suffix: '+', color: 'from-lime-500 to-emerald-600' },
          { label: 'Client Satisfaction', value: 100, suffix: '%', color: 'from-emerald-500 to-green-600' }
        ]
      });
    }
    
    res.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// Update stats (admin only)
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { stats } = req.body;
    
    if (!Array.isArray(stats)) {
      return res.status(400).json({ message: 'Stats must be an array' });
    }
    
    // Delete all existing stats
    await Stats.deleteMany({});
    
    // Insert new stats
    const newStats = await Stats.insertMany(stats);
    
    res.json({ message: 'Stats updated successfully', stats: newStats });
  } catch (error) {
    console.error('Error updating stats:', error);
    res.status(500).json({ message: 'Error updating stats', error: error.message });
  }
});

module.exports = router;

