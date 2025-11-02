const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/metacodsar', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@metacodsar.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('password', 10);

    // Create admin user
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
    console.log('Admin user created successfully!');
    console.log('Email: admin@metacodsar.com');
    console.log('Password: password');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
}

createAdminUser();
