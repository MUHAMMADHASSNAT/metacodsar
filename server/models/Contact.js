const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  email: {
    type: String,
    default: 'info@metacodsar.com'
  },
  phone: {
    type: String,
    default: '+92 300 1234567'
  },
  address: {
    type: String,
    default: 'Pakistan'
  },
  officeHours: {
    type: String,
    default: 'Mon-Fri from 9am to 6pm'
  }
}, {
  timestamps: true
});

// Only one contact document should exist
contactSchema.statics.getContactInfo = async function() {
  let contact = await this.findOne();
  if (!contact) {
    contact = await this.create({});
  }
  return contact;
};

module.exports = mongoose.model('Contact', contactSchema);

