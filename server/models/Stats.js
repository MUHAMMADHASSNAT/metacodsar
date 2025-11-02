const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: Number,
    required: true
  },
  suffix: {
    type: String,
    default: '+'
  },
  color: {
    type: String,
    default: 'from-emerald-500 to-green-600'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Stats', statsSchema);

