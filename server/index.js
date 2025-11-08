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

// MongoDB Connection - Single attempt only (no retries)
// Default connection string (updated with Atlas SQL connection string)
const DEFAULT_MONGODB_URI = 'mongodb://metacodsar:metacodsars@atlas-sql-68f3661a73497c6e807242fb-7yiz8v.a.query.mongodb.net/metacodsar?ssl=true&authSource=admin';
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || DEFAULT_MONGODB_URI;

// Validate MongoDB URI format
const validateMongoURI = (uri) => {
  if (!uri) return { valid: false, error: 'URI is empty' };
  
  // Check if it's a valid MongoDB URI
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    return { valid: false, error: 'Invalid URI format. Must start with mongodb:// or mongodb+srv://' };
  }
  
  // Check for required components
  if (uri.includes('@') && !uri.includes('://')) {
    return { valid: false, error: 'Invalid URI format' };
  }
  
  return { valid: true };
};

// Optimize MongoDB URI with connection options
const optimizeMongoURI = (uri) => {
  if (!uri) return uri;
  
  // Add database name if missing (default: metacodsar)
  // Check if URI has database name after .net/ or .net?
  const hasDatabase = /\.net\/[^?]/.test(uri) || /\.net\/\?/.test(uri);
  if (!hasDatabase) {
    // Add database name before query params or at the end
    if (uri.includes('?')) {
      uri = uri.replace('?', '/metacodsar?');
    } else {
      uri = uri.endsWith('/') ? uri + 'metacodsar' : uri + '/metacodsar';
    }
  }
  
  // Add connection options if not present
  if (!uri.includes('?')) {
    return `${uri}?retryWrites=true&w=majority&maxPoolSize=10&minPoolSize=2`;
  }
  
  // Add options if query params exist (preserve existing params like appName)
  if (!uri.includes('retryWrites')) {
    uri += (uri.includes('?') && !uri.endsWith('?') && !uri.endsWith('&') ? '&' : '') + 'retryWrites=true';
  }
  if (!uri.includes('w=majority')) {
    uri += '&w=majority';
  }
  
  return uri;
};

// Connect to MongoDB - Single attempt only
const connectMongoDB = async () => {
  // Check if using default placeholder values
  if (MONGODB_URI.includes('<db_username>') || MONGODB_URI.includes('<db_password>')) {
    console.log('');
    console.log('========================================');
    console.log('⚠️  MongoDB Credentials Required!');
    console.log('========================================');
    console.log('❌ Please replace <db_username> and <db_password> with actual values');
    console.log('');
    console.log('🔧 Solution:');
    console.log('1️⃣  Edit .env file in server folder');
    console.log('2️⃣  Replace in MONGODB_URI:');
    console.log('   <db_username> → Your MongoDB Atlas username');
    console.log('   <db_password> → Your MongoDB Atlas password');
    console.log('');
    console.log('📝 Example:');
    console.log('   MONGODB_URI=mongodb+srv://myuser:mypass123@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0');
    console.log('');
    console.log('ℹ️  Server is running but database features will NOT work until credentials are set');
    console.log('========================================');
    console.log('');
    return;
  }

  if (!MONGODB_URI) {
    console.log('');
    console.log('========================================');
    console.log('⚠️  MONGODB_URI Not Found!');
    console.log('========================================');
    console.log('❌ MongoDB connection string missing');
    console.log('');
    console.log('🔧 Solution:');
    console.log('1️⃣  Create .env file in server folder');
    console.log('2️⃣  Add: MONGODB_URI=mongodb+srv://username:password@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0');
    console.log('');
    console.log('ℹ️  Server is running but database features will NOT work');
    console.log('========================================');
    console.log('');
    return;
  }

  // Validate URI format
  const validation = validateMongoURI(MONGODB_URI);
  if (!validation.valid) {
    console.log('');
    console.log('========================================');
    console.log('❌ Invalid MongoDB URI Format!');
    console.log('========================================');
    console.log(`⚠️  Error: ${validation.error}`);
    console.log('');
    console.log('🔧 Correct Format Examples:');
    console.log('   MongoDB Atlas: mongodb+srv://username:password@cluster0.7r3ulvb.mongodb.net/metacodsar');
    console.log('   With appName: mongodb+srv://username:password@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0');
    console.log('   Local MongoDB: mongodb://localhost:27017/metacodsar');
    console.log('========================================');
    console.log('');
    return;
  }

  console.log('');
  console.log('🔄 Attempting MongoDB connection (single attempt)...');
  console.log(`📡 Connection URI: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`); // Hide credentials

  try {
    const optimizedURI = optimizeMongoURI(MONGODB_URI);
    
    await mongoose.connect(optimizedURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
    });

    console.log('');
    console.log('========================================');
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🖥️  Host: ${mongoose.connection.host}`);
    console.log(`🔌 Ready State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    console.log('========================================');
    console.log('');
    
    // Auto-create admin user if it doesn't exist
    try {
      const User = require('./models/User');
      const bcrypt = require('bcryptjs');
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
        console.log('   📧 Email: admin@metacodsar.com');
        console.log('   🔑 Password: password');
        console.log('');
      } else {
        console.log('ℹ️  Admin user already exists');
        console.log('');
      }
    } catch (error) {
      console.log('⚠️  Error creating admin user:', error.message);
      console.log('');
    }

    // Set up connection event handlers (no auto-reconnect)
    mongoose.connection.on('error', (err) => {
      console.log('⚠️  MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected.');
      console.log('ℹ️  Server restart required to reconnect.');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });

  } catch (err) {
    console.log('');
    console.log('========================================');
    console.log('❌ MongoDB Connection Failed!');
    console.log('========================================');
    console.log(`⚠️  Error: ${err.message}`);
    console.log('');
    
    // Detailed error messages
    if (err.message.includes('authentication failed')) {
      console.log('🔐 Authentication Error:');
      console.log('   - Check username and password in connection string');
      console.log('   - Verify MongoDB Atlas user credentials');
      console.log('   - Username: metacodsar');
      console.log('   - Password: metacodsars');
      console.log('');
    } else if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      console.log('🌐 Network Error:');
      console.log('   - Check internet connection');
      console.log('   - Verify MongoDB Atlas cluster URL');
      console.log('   - Check DNS resolution');
      console.log('');
    } else if (err.message.includes('timeout')) {
      console.log('⏱️  Timeout Error:');
      console.log('   - MongoDB server might be slow or unreachable');
      console.log('   - Check MongoDB Atlas cluster status');
      console.log('   - Verify network access settings');
      console.log('');
    } else if (err.message.includes('IP')) {
      console.log('🔒 IP Whitelist Error:');
      console.log('   - Add your IP to MongoDB Atlas Network Access');
      console.log('   - Or use 0.0.0.0/0 for all IPs (less secure)');
      console.log('   - MongoDB Atlas → Network Access → Add IP Address');
      console.log('');
    }
    
    console.log('🔧 Possible Solutions:');
    console.log('1️⃣  Check MONGODB_URI in .env file:');
    console.log('   mongodb+srv://metacodsar:metacodsars@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0');
    console.log('');
    console.log('2️⃣  Verify MongoDB Atlas Network Access:');
    console.log('   - MongoDB Atlas Dashboard → Network Access');
    console.log('   - Add IP: 0.0.0.0/0 (allow all IPs)');
    console.log('');
    console.log('3️⃣  Check MongoDB Atlas user credentials:');
    console.log('   - Database Access → Users');
    console.log('   - Username: metacodsar');
    console.log('   - Password: metacodsars');
    console.log('');
    console.log('4️⃣  Verify connection string format:');
    console.log('   - Must start with: mongodb+srv://');
    console.log('   - Format: mongodb+srv://username:password@cluster/database?appName=Cluster0');
    console.log('');
    console.log('ℹ️  Server is running but database features will NOT work');
    console.log('   Login, projects, team features require MongoDB');
    console.log('   Server restart required to retry connection');
    console.log('========================================');
    console.log('');
  }
};

// Start connection
connectMongoDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/team', require('./routes/team'));
app.use('/api/stats', require('./routes/stats'));

// Health check endpoint with MongoDB status
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({ 
    status: 'OK', 
    message: 'MetaCodsar API is running',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatusText[dbStatus] || 'unknown',
      readyState: dbStatus,
      connected: dbStatus === 1,
      name: dbStatus === 1 ? mongoose.connection.name : null,
      host: dbStatus === 1 ? mongoose.connection.host : null
    }
  });
});

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}