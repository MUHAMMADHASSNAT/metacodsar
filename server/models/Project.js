const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  technologies: [{
    type: String
  }],
  imageUrl: {
    type: String
  },
  images: [{
    type: String
  }],
  liveUrl: {
    type: String
  },
  githubUrl: {
    type: String
  },
  category: {
    type: String,
    default: 'web'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
