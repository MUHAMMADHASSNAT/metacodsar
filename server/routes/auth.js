const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

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

// Login route (optimized for speed)
router.post('/login', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check MongoDB connection first
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB not connected. State:', mongoose.connection.readyState);
      return res.status(503).json({ 
        message: 'Database connection not ready. Please try again in a moment.',
        error: 'MongoDB not connected',
        mongodbState: mongoose.connection.readyState,
        retry: true,
        retryAfter: 3
      });
    }

    // Find user by email (with increased timeout for slow connections)
    let user;
    try {
      // Use a longer timeout and better error handling
      const queryPromise = User.findOne({ email }).maxTimeMS(15000); // 15 seconds max query time
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 15000) // 15 seconds
      );
      
      user = await Promise.race([queryPromise, timeoutPromise]);
    } catch (queryError) {
      console.error('❌ User query error:', queryError);
      console.error('❌ MongoDB connection state:', mongoose.connection.readyState);
      console.error('❌ Error details:', {
        name: queryError.name,
        message: queryError.message,
        stack: queryError.stack
      });
      
      // Check if it's a timeout or connection error
      if (queryError.message.includes('timeout') || queryError.message.includes('Connection') || queryError.message.includes('buffering')) {
        return res.status(503).json({ 
          message: 'Database query timeout. The server is processing your request. Please try again in a moment.',
          error: 'Query timeout',
          mongodbState: mongoose.connection.readyState,
          retry: true,
          retryAfter: 3
        });
      }
      
      // For other errors, return 500 with details
      console.error('❌ Database query error:', queryError);
      return res.status(500).json({ 
        message: 'Database error occurred. Please try again.',
        error: queryError.message || 'Database query failed',
        errorName: queryError.name,
        mongodbState: mongoose.connection.readyState,
        retry: true,
        retryAfter: 2
      });
    }
    
    // Auto-create admin user if login attempt with admin credentials and user doesn't exist
    if (!user && email === 'admin@metacodsar.com' && password === 'password') {
      try {
        // Create admin user on the fly with timeout protection
        const hashedPassword = await bcrypt.hash('password', 10);
        const newAdmin = new User({
          name: 'Admin User',
          email: 'admin@metacodsar.com',
          password: hashedPassword,
          phone: '+1234567890',
          designation: 'System Administrator',
          role: 'admin',
          isActive: true
        });
        
        // Save with timeout protection
        const savePromise = newAdmin.save();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Save timeout')), 10000)
        );
        
        await Promise.race([savePromise, timeoutPromise]);
        user = newAdmin;
        console.log('✅ Admin user created on login attempt');
      } catch (createError) {
        console.error('⚠️  Error creating admin user:', createError.message);
        // If creation fails, try to find user again (might have been created by another request)
        try {
          user = await User.findOne({ email: 'admin@metacodsar.com' }).maxTimeMS(5000);
        } catch (findError) {
          console.error('❌ Error finding admin user after creation failure:', findError.message);
          // Continue - will return invalid credentials error
        }
      }
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check password with timeout protection
    let isMatch;
    try {
      const comparePromise = bcrypt.compare(password, user.password);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Password comparison timeout')), 5000)
      );
      isMatch = await Promise.race([comparePromise, timeoutPromise]);
    } catch (compareError) {
      console.error('❌ Password comparison error:', compareError.message);
      return res.status(500).json({ 
        message: 'Server error during authentication. Please try again.',
        error: 'Authentication timeout',
        retry: true,
        retryAfter: 2
      });
    }
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    const duration = Date.now() - startTime;
    console.log(`✅ Login successful in ${duration}ms`);
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Login error after ${duration}ms:`, error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ MongoDB connection state:', mongoose.connection.readyState);
    
    // More detailed error response
    let errorMessage = 'Server error';
    let errorDetails = {};
    
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      errorMessage = 'Database connection failed';
      errorDetails = {
        mongodbState: mongoose.connection.readyState,
        states: {
          0: 'disconnected',
          1: 'connected',
          2: 'connecting',
          3: 'disconnecting'
        }
      };
    } else if (error.message) {
      errorMessage = error.message;
      errorDetails = {
        name: error.name,
        message: error.message
      };
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: errorDetails,
      mongodbConnected: mongoose.connection.readyState === 1,
      retry: true,
      retryAfter: 3
    });
  }
});

// Register route (for admin use)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, designation, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      designation,
      role: role || 'user',
      isActive: true
    });

    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile route (for username/email change)
router.put('/update-profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, designation } = req.body;
    const userId = req.user.userId;

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (designation) updateData.designation = designation;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile route (backward compatibility)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, designation } = req.body;
    const userId = req.user.userId;

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (designation) updateData.designation = designation;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get profile route
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password route
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;