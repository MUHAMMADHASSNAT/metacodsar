const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5001;
const JWT_SECRET = 'metacodsar-secret-key-2024';

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Mock user data
const users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@metacodsar.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin',
    phone: '1234567890',
    designation: 'Admin',
    profilePicture: ''
  },
  {
    id: 2,
    name: 'Team Member',
    email: 'team@metacodsar.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'user',
    phone: '0987654321',
    designation: 'Developer',
    profilePicture: ''
  }
];

// Mock projects data
const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution with React frontend and Node.js backend',
    image: 'https://via.placeholder.com/400x225/4F46E5/FFFFFF?text=E-Commerce',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    githubUrl: 'https://github.com/example/ecommerce',
    liveUrl: 'https://ecommerce-demo.com',
    teamMember: 'Team Member',
    createdAt: new Date().toISOString()
  }
];

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        designation: user.designation,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Profile update
app.put('/api/auth/profile', authenticateToken, (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const user = users.find(u => u.id === req.user.userId);
    
    if (user) {
      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (email) user.email = email;
      
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        designation: user.designation,
        profilePicture: user.profilePicture
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Projects routes
app.get('/api/projects', (req, res) => {
  try {
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add project
app.post('/api/projects', authenticateToken, (req, res) => {
  try {
    const { title, description, technologies, githubUrl, liveUrl, teamMember } = req.body;
    
    const newProject = {
      id: projects.length + 1,
      title,
      description,
      image: 'https://via.placeholder.com/400x225/4F46E5/FFFFFF?text=Project',
      technologies: technologies.split(',').map(tech => tech.trim()),
      githubUrl,
      liveUrl,
      teamMember,
      createdAt: new Date().toISOString()
    };
    
    projects.push(newProject);
    res.status(201).json({ message: 'Project added successfully' });
  } catch (error) {
    console.error('Add project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add team member
app.post('/api/team', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { name, email, password, phone, designation } = req.body;
    
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      role: 'user',
      phone,
      designation,
      profilePicture: ''
    };
    
    users.push(newUser);
    res.status(201).json({ message: 'Team member added successfully' });
  } catch (error) {
    console.error('Add team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update team member
app.put('/api/team/:id', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const userId = parseInt(req.params.id);
    const { name, email, phone, designation } = req.body;
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (designation) user.designation = designation;

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      designation: user.designation,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove team member
app.delete('/api/team/:id', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    users.splice(userIndex, 1);
    res.json({ message: 'Team member removed successfully' });
  } catch (error) {
    console.error('Remove team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MetaCodsar API is running on port 5001',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📱 Client: http://localhost:5173`);
  console.log(`✅ Server started successfully!`);
  console.log(`🔐 Login: admin@metacodsar.com / password`);
  console.log(`🔐 Team: team@metacodsar.com / password`);
});
