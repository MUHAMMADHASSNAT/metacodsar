const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/metacodsar', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createTeamUser() {
  try {
    // Check if team user already exists
    const existingTeam = await User.findOne({ email: 'team@metacodsar.com' });
    if (existingTeam) {
      console.log('Team user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('password', 10);

    // Create team user
    const teamUser = new User({
      name: 'Team Member',
      email: 'team@metacodsar.com',
      password: hashedPassword,
      phone: '+92 300 2345678',
      designation: 'Developer',
      role: 'user',
      isActive: true
    });

    await teamUser.save();
    console.log('Team user created successfully!');
    console.log('Email: team@metacodsar.com');
    console.log('Password: password');
  } catch (error) {
    console.error('Error creating team user:', error);
  } finally {
    mongoose.connection.close();
  }
}

createTeamUser();






