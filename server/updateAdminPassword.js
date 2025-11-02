const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/metacodsar', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function updateAdminPassword() {
  try {
    // Find admin user
    const admin = await User.findOne({ email: 'admin@metacodsar.com' });
    if (!admin) {
      console.log('Admin user not found');
      return;
    }

    // Update password
    const hashedPassword = await bcrypt.hash('password', 10);
    admin.password = hashedPassword;
    await admin.save();

    console.log('Admin password updated successfully!');
    console.log('Email: admin@metacodsar.com');
    console.log('Password: password');
  } catch (error) {
    console.error('Error updating admin password:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateAdminPassword();

