const express = require('express');
const multer = require('multer');
const path = require('path');
const Project = require('../models/Project');
const router = express.Router();

// Configure multer for project images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/projects/');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  }
});

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

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ isActive: true });
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new project (admin only)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, technologies, imageUrl, githubUrl, category } = req.body;
    
    // Use uploaded file if available, otherwise use provided imageUrl
    let finalImageUrl = imageUrl;
    if (req.file) {
      finalImageUrl = `http://localhost:5001/projects/${req.file.filename}`;
    }

    const project = new Project({
      title,
      description,
      technologies: Array.isArray(technologies) ? technologies : technologies.split(',').map(t => t.trim()),
      imageUrl: finalImageUrl,
      githubUrl,
      category: category || 'web',
      isActive: true
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project (admin only)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, technologies, imageUrl, githubUrl, category } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (technologies) {
      updateData.technologies = Array.isArray(technologies) ? technologies : technologies.split(',').map(t => t.trim());
    }
    
    // Handle image upload
    if (req.file) {
      updateData.imageUrl = `http://localhost:5001/projects/${req.file.filename}`;
    } else if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl;
    }
    
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (category) updateData.category = category;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project (admin only) - soft delete
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;