const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();

// CORS configuration for Vercel
const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://metacodsar.vercel.app',
  'https://metacodsar-git-main.vercel.app',
  'https://metacodsar-git-*.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const pattern = allowed.replace('*', '.*');
        return new RegExp(pattern).test(origin);
      }
      return allowed === origin;
    })) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now, restrict in production
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
  .then(() => {
    console.log('✅ MongoDB connected successfully');
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
