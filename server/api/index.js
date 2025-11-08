const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const app = express();

// CORS configuration for Vercel
// Support both CLIENT_URL and FRONTEND_URL (CLIENT_URL has priority)
const CLIENT_URL = process.env.CLIENT_URL || process.env.FRONTEND_URL || 'https://metacodsar-h3a4.vercel.app';
const allowedOrigins = [
  CLIENT_URL,
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

if (CLIENT_URL) {
  console.log('✅ CLIENT_URL configured:', CLIENT_URL);
} else {
  console.warn('⚠️ CLIENT_URL or FRONTEND_URL not set in environment variables');
  console.warn('   Set CLIENT_URL (or FRONTEND_URL) in Vercel Dashboard → Server Project → Environment Variables');
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
        if (CLIENT_URL) {
          console.log('   Make sure client URL matches CLIENT_URL:', CLIENT_URL);
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

// Request timeout middleware (9 seconds for Vercel free tier - leave buffer)
app.use((req, res, next) => {
  // Set timeout for requests (9 seconds to leave buffer for Vercel's 10s limit)
  req.setTimeout(9000, () => {
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
          setTimeout(() => reject(new Error('Connection timeout')), 8000) // Increased to 8 seconds
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
      
      // Optimized connection settings for Vercel serverless (increased timeouts for reliability)
      await mongoose.connect(optimizedURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 8000, // 8 seconds (increased for slow connections)
        socketTimeoutMS: 45000,
        connectTimeoutMS: 8000, // 8 seconds (increased for slow connections)
        maxPoolSize: 1,
        minPoolSize: 0, // Don't keep connection open
        maxIdleTimeMS: 10000, // Close idle connections quickly
        heartbeatFrequencyMS: 10000,
      });
      
      console.log('✅ MongoDB connected successfully');
      console.log('📊 Database:', mongoose.connection.name);
      console.log('🖥️  Host:', mongoose.connection.host);
      console.log('🔌 Ready State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
      
      // Create admin user in background (non-blocking)
      createAdminUserInBackground();
      
      return true;
    } catch (err) {
      console.error('❌ MongoDB connection error:', err.message);
      console.error('❌ Error details:', {
        name: err.name,
        message: err.message,
        code: err.code
      });
      connectionPromise = null;
      return false;
    }
  })();

  try {
    // Increased timeout - 8 seconds max for better reliability
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 8000)
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

// Initialize MongoDB connection on startup (for Vercel)
// This ensures connection is ready when first request comes
const initializeMongoDB = async () => {
  if (!MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not set in environment variables');
    console.warn('   MongoDB connection will fail. Please set MONGODB_URI in Vercel Dashboard.');
    return;
  }

  console.log('🔄 Initializing MongoDB connection...');
  console.log('📡 MONGODB_URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
  
  try {
    const connected = await connectDB();
    if (connected) {
      console.log('✅ MongoDB initialized successfully on startup');
    } else {
      console.warn('⚠️  MongoDB initialization failed, will retry on first request');
    }
  } catch (error) {
    console.error('❌ MongoDB initialization error:', error.message);
    console.warn('⚠️  Will retry connection on first request');
  }
};

// Start MongoDB connection initialization (non-blocking)
initializeMongoDB().catch(err => {
  console.error('❌ Failed to initialize MongoDB:', err.message);
});

// Health check endpoint (no DB required)
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const dbStateText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({ 
    status: 'OK', 
    message: 'MetaCodsar API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    mongodb: dbStatus,
    mongodbState: mongoose.connection.readyState,
    mongodbStateText: dbStateText[mongoose.connection.readyState] || 'unknown',
    mongodbUriSet: !!MONGODB_URI
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
  
  // Try to connect with increased timeout (8 seconds max)
  try {
    const connectPromise = connectDB();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 8000)
    );
    
    const connected = await Promise.race([connectPromise, timeoutPromise]);
    
    if (!connected) {
      // If connection is in progress, allow request to proceed (optimistic)
      // This helps with slow connections - let the request try to use DB
      if (mongoose.connection.readyState === 2) {
        console.log('⏳ Connection in progress, proceeding with request (optimistic)');
        return next();
      }
      
      // If not connected and not connecting, return error but with retry hint
      console.warn('⚠️  MongoDB not connected, returning 503');
      return res.status(503).json({ 
        message: 'Database connection timeout. The server is connecting to the database. Please try again in a moment.',
        error: 'MongoDB connection timeout',
        hint: 'Server is starting up or database is slow. Please wait a moment and retry.',
        retry: true,
        retryAfter: 3
      });
    }
    
    next();
  } catch (error) {
    // If connection is in progress, allow request to proceed (optimistic)
    if (mongoose.connection.readyState === 2) {
      console.log('⏳ Connection in progress, proceeding with request (optimistic)');
      return next();
    }
    
    console.error('❌ MongoDB connection error in middleware:', error.message);
    return res.status(503).json({ 
      message: 'Database connection failed. The server is trying to connect. Please try again in a moment.',
      error: 'MongoDB not connected',
      hint: 'Check MONGODB_URI in Vercel environment variables. Server will retry automatically.',
      retry: true,
      retryAfter: 3
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
