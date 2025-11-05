const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const app = express();

// CORS configuration for Vercel
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://metacodsar-h3a4.vercel.app';
const allowedOrigins = [
  FRONTEND_URL,
  'https://metacodsar-h3a4.vercel.app', // Main frontend URL
  'https://metacodsar-h3a4-git-main.vercel.app', // Vercel preview URLs
  'https://metacodsar-h3a4-git-*.vercel.app',
  'https://metacodsar-git-main.vercel.app',
  'https://metacodsar-git-*.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
].filter(Boolean); // Remove undefined values

if (FRONTEND_URL) {
  console.log('✅ FRONTEND_URL configured:', FRONTEND_URL);
} else {
  console.warn('⚠️ FRONTEND_URL not set in environment variables');
  console.warn('   Set FRONTEND_URL in Vercel Dashboard → Server Project → Environment Variables');
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin matches any allowed origin
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const pattern = allowed.replace(/\*/g, '.*');
        return new RegExp(pattern).test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      // In production, log the blocked origin for debugging
      if (process.env.NODE_ENV === 'production') {
        console.log('⚠️ CORS: Blocked origin:', origin);
        console.log('   Allowed origins:', allowedOrigins);
        if (FRONTEND_URL) {
          console.log('   Make sure client URL matches FRONTEND_URL:', FRONTEND_URL);
        }
      }
      // For now, allow all origins (restrict in production if needed)
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure multer for file uploads (using memory storage for serverless)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('✅ MongoDB connected successfully');
    
    // Auto-create admin user if it doesn't exist
    try {
      const existingAdmin = await User.findOne({ email: 'admin@metacodsar.com' });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('password', 10);
        const admin = new User({
          name: 'Admin User',
          email: 'admin@metacodsar.com',
          password: hashedPassword,
          phone: '+1234567890',
          designation: 'System Administrator',
          role: 'admin',
          isActive: true
        });
        await admin.save();
        console.log('✅ Admin user created successfully');
        console.log('   Email: admin@metacodsar.com');
        console.log('   Password: password');
      } else {
        console.log('ℹ️  Admin user already exists');
      }
    } catch (error) {
      console.log('⚠️  Error creating admin user:', error.message);
    }
  })
  .catch(err => {
    console.log('⚠️  MongoDB connection error:', err.message);
  });
}

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/contact', require('../routes/contact'));
app.use('/api/projects', require('../routes/projects'));
app.use('/api/team', require('../routes/team'));
app.use('/api/stats', require('../routes/stats'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MetaCodsar API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'MetaCodsar API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      projects: '/api/projects',
      team: '/api/team',
      contact: '/api/contact',
      stats: '/api/stats'
    }
  });
});

// Export for Vercel serverless
module.exports = app;
