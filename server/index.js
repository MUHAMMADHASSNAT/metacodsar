const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');

// Load environment variables
dotenv.config();

const app = express();
// Use environment variable or default to 5001
const PORT = process.env.PORT || 5001;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'), false)
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'uploads')));
// Serve uploaded images
app.use('/team', express.static(path.join(__dirname, 'uploads/team')));
app.use('/projects', express.static(path.join(__dirname, 'uploads/projects')));

// Define startServer function before using it
const startServer = (port) => {
  try {
    const server = app.listen(port, '0.0.0.0', () => {
      console.log('');
      console.log('========================================');
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`🔗 Health check: http://localhost:${port}/api/health`);
      console.log(`📱 Client: http://localhost:5173`);
      console.log(`✅ Server ready to accept connections!`);
      console.log('========================================');
      console.log('');
    });

    server.on('error', (err) => {
      console.error('');
      console.error('❌ Server error:', err);
      if (err.code === 'EADDRINUSE') {
        console.error(`\n⚠️  Port ${port} is already in use!`);
        console.error(`\nWindows PowerShell se port ko free karne ke liye:`);
        console.error(`1. Find process: netstat -ano | findstr :${port}`);
        console.error(`2. Kill process: taskkill /PID <PID_NUMBER> /F`);
        console.error(`\nYa simple command: cd server && node free-port.js`);
        console.error('');
      } else {
        console.error('❌ Unknown server error:', err);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start server immediately (don't wait for MongoDB)
startServer(PORT);

// MongoDB Connection (non-blocking)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/metacodsar', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch(err => {
  console.log('⚠️  MongoDB connection error (server will work without it):', err.message);
  console.log('ℹ️  Server is running but database features may not work');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/team', require('./routes/team'));
app.use('/api/stats', require('./routes/stats'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MetaCodsar API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}