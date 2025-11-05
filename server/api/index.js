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

// Request timeout middleware (8 seconds for Vercel free tier)
app.use((req, res, next) => {
  // Set timeout for requests
  req.setTimeout(8000, () => {
    if (!res.headersSent) {
      res.status(504).json({ 
        message: 'Request timeout',
        error: 'Server took too long to respond',
        hint: 'Please try again'
      });
    }
  });
  next();
});

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

// MongoDB Connection (Optimized for Vercel serverless with timeout handling)
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// Connection promise cache (for serverless reuse)
let connectionPromise = null;
let adminCreated = false;

// Function to ensure MongoDB connection (optimized for speed)
const connectDB = async () => {
  if (!MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not set in environment variables');
    return false;
  }

  // If already connected, return immediately
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  // If connection is in progress, wait for it
  if (mongoose.connection.readyState === 2) {
    console.log('⏳ MongoDB connection in progress, waiting...');
    if (connectionPromise) {
      return connectionPromise;
    }
  }

  // Create connection promise with timeout
  connectionPromise = (async () => {
    try {
      // Use fast connection settings for Vercel serverless
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 3000, // Reduced to 3 seconds
        socketTimeoutMS: 45000, // 45 seconds socket timeout
        connectTimeoutMS: 3000, // 3 seconds connection timeout
        maxPoolSize: 1, // Single connection for serverless
        minPoolSize: 1,
        maxIdleTimeMS: 30000, // Close idle connections after 30s
      });
      
      console.log('✅ MongoDB connected successfully');
      
      // Auto-create admin user only once (skip if already created)
      if (!adminCreated) {
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
            adminCreated = true;
          } else {
            console.log('ℹ️  Admin user already exists');
            adminCreated = true;
          }
        } catch (error) {
          console.log('⚠️  Error creating admin user:', error.message);
          // Don't fail the connection if admin creation fails
        }
      }
      
      return true;
    } catch (err) {
      console.log('⚠️  MongoDB connection error:', err.message);
      connectionPromise = null; // Reset promise on error
      return false;
    }
  })();

  try {
    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 5000)
    );
    
    return await Promise.race([connectionPromise, timeoutPromise]);
  } catch (err) {
    connectionPromise = null;
    console.log('⚠️  MongoDB connection timeout:', err.message);
    return false;
  }
};

// Connect on startup (for serverless, this will be called on first request)
// Don't await - let it connect in background
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err.message);
});

// Health check endpoint (no DB required)
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'OK', 
    message: 'MetaCodsar API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    mongodb: dbStatus
  });
});

// Middleware to ensure MongoDB connection before handling requests (except health check)
// Optimized for speed - don't block too long
app.use(async (req, res, next) => {
  // Skip health check and root endpoint
  if (req.path === '/api/health' || req.path === '/') {
    return next();
  }
  
  // If already connected, proceed immediately
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  
  // Try to connect with timeout
  try {
    const connectPromise = connectDB();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 4000)
    );
    
    const connected = await Promise.race([connectPromise, timeoutPromise]);
    
    if (!connected) {
      return res.status(503).json({ 
        message: 'Database connection timeout. Please try again.',
        error: 'MongoDB connection timeout',
        hint: 'Server is starting up. Please wait a moment and retry.',
        retry: true
      });
    }
    
    next();
  } catch (error) {
    // If connection is in progress, allow request to proceed (optimistic)
    if (mongoose.connection.readyState === 2) {
      console.log('⏳ Connection in progress, proceeding with request');
      return next();
    }
    
    return res.status(503).json({ 
      message: 'Database connection failed. Please try again.',
      error: 'MongoDB not connected',
      hint: 'Check MONGODB_URI in Vercel environment variables',
      retry: true
    });
  }
});

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/contact', require('../routes/contact'));
app.use('/api/projects', require('../routes/projects'));
app.use('/api/team', require('../routes/team'));
app.use('/api/stats', require('../routes/stats'));

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
// For Express apps, export the app directly
module.exports = app;
