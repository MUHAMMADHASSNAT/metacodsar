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

// Request timeout middleware (7 seconds for Vercel free tier - leave buffer)
app.use((req, res, next) => {
  // Set timeout for requests (7 seconds to leave buffer for Vercel's 10s limit)
  req.setTimeout(7000, () => {
    if (!res.headersSent) {
      res.status(504).json({ 
        message: 'Request timeout',
        error: 'Server took too long to respond',
        hint: 'Please try again. Server might be starting up.',
        retry: true,
        retryAfter: 3
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

// MongoDB Connection (Aggressively optimized for Vercel serverless)
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// Connection promise cache (for serverless reuse)
let connectionPromise = null;
let adminCreationPromise = null;

// Optimize MongoDB URI for faster connection
const optimizeMongoURI = (uri) => {
  if (!uri) return uri;
  
  // Add connection options if not present
  if (!uri.includes('?')) {
    return `${uri}?retryWrites=true&w=majority&maxPoolSize=1&minPoolSize=0&maxIdleTimeMS=30000`;
  }
  
  // Add options if query params exist
  if (!uri.includes('retryWrites')) {
    uri += (uri.includes('?') && !uri.endsWith('?') && !uri.endsWith('&') ? '&' : '') + 'retryWrites=true';
  }
  if (!uri.includes('w=majority')) {
    uri += '&w=majority';
  }
  
  return uri;
};

// Function to ensure MongoDB connection (ultra-fast)
const connectDB = async () => {
  if (!MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not set in environment variables');
    return false;
  }

  // If already connected, return immediately
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  // If connection is in progress, wait for it (but with timeout)
  if (mongoose.connection.readyState === 2) {
    if (connectionPromise) {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 2000)
        );
        return await Promise.race([connectionPromise, timeoutPromise]);
      } catch (err) {
        console.log('⚠️  Waiting for connection timed out');
        connectionPromise = null;
      }
    }
  }

  // Create connection promise with aggressive timeout
  connectionPromise = (async () => {
    try {
      const optimizedURI = optimizeMongoURI(MONGODB_URI);
      
      // Ultra-fast connection settings for Vercel serverless
      await mongoose.connect(optimizedURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 2000, // 2 seconds (aggressive)
        socketTimeoutMS: 45000,
        connectTimeoutMS: 2000, // 2 seconds
        maxPoolSize: 1,
        minPoolSize: 0, // Don't keep connection open
        maxIdleTimeMS: 10000, // Close idle connections quickly
        heartbeatFrequencyMS: 10000,
      });
      
      console.log('✅ MongoDB connected successfully');
      
      // Create admin user in background (non-blocking)
      createAdminUserInBackground();
      
      return true;
    } catch (err) {
      console.log('⚠️  MongoDB connection error:', err.message);
      connectionPromise = null;
      return false;
    }
  })();

  try {
    // Aggressive timeout - 2.5 seconds max
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 2500)
    );
    
    return await Promise.race([connectionPromise, timeoutPromise]);
  } catch (err) {
    connectionPromise = null;
    console.log('⚠️  MongoDB connection timeout:', err.message);
    return false;
  }
};

// Create admin user in background (non-blocking)
const createAdminUserInBackground = async () => {
  // Prevent multiple simultaneous admin creation attempts
  if (adminCreationPromise) {
    return adminCreationPromise;
  }
  
  adminCreationPromise = (async () => {
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
      } else {
        console.log('ℹ️  Admin user already exists');
      }
    } catch (error) {
      console.log('⚠️  Error creating admin user:', error.message);
      // Don't throw - this is background task
    } finally {
      adminCreationPromise = null;
    }
  })();
  
  // Don't await - let it run in background
  adminCreationPromise.catch(() => {
    adminCreationPromise = null;
  });
};

// Don't connect on startup - let it connect on first request (faster cold start)

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
// Ultra-fast - aggressive timeout
app.use(async (req, res, next) => {
  // Skip health check and root endpoint
  if (req.path === '/api/health' || req.path === '/') {
    return next();
  }
  
  // If already connected, proceed immediately
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  
  // Try to connect with aggressive timeout (2.5 seconds max)
  try {
    const connectPromise = connectDB();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 2500)
    );
    
    const connected = await Promise.race([connectPromise, timeoutPromise]);
    
    if (!connected) {
      // If connection is in progress, allow request to proceed (optimistic)
      if (mongoose.connection.readyState === 2) {
        console.log('⏳ Connection in progress, proceeding with request');
        return next();
      }
      
      return res.status(503).json({ 
        message: 'Database connection timeout. Please try again in 2 seconds.',
        error: 'MongoDB connection timeout',
        hint: 'Server is starting up. Please wait a moment and retry.',
        retry: true,
        retryAfter: 2
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
      retry: true,
      retryAfter: 2
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
