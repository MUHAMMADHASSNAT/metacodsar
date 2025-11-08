const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/metacodsar', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testLogin() {
  try {
    // Find admin user
    const admin = await User.findOne({ email: 'admin@metacodsar.com' });
    if (!admin) {
      console.log('Admin user not found');
      return;
    }

    console.log('Admin user found:');
    console.log('Name:', admin.name);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Password hash:', admin.password);

    // Test password
    const isMatch = await bcrypt.compare('password', admin.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      // Update password
      const hashedPassword = await bcrypt.hash('password', 10);
      admin.password = hashedPassword;
      await admin.save();
      console.log('Password updated successfully');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testLogin();










