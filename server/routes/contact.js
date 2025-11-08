const express = require('express');
const Contact = require('../models/Contact');
const router = express.Router();

// Get contact information (public)
router.get('/', async (req, res) => {
  try {
    const contactInfo = await Contact.getContactInfo();
    res.json({
      email: contactInfo.email,
      phone: contactInfo.phone,
      address: contactInfo.address,
      officeHours: contactInfo.officeHours
    });
  } catch (error) {
    console.error('Get contact info error:', error);
    // Return default values if error
    res.json({
      email: 'info@metacodsar.com',
      phone: '+92 300 1234567',
      address: 'Pakistan',
      officeHours: 'Mon-Fri from 9am to 6pm'
    });
  }
});

// Update contact information (admin only)
router.put('/', async (req, res) => {
  try {
    // Verify admin token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const jwt = require('jsonwebtoken');
    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    } catch (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { email, phone, address, officeHours } = req.body;

    // Get or create contact info
    let contactInfo = await Contact.findOne();
    if (!contactInfo) {
      contactInfo = new Contact({});
    }

    // Update fields
    if (email !== undefined) contactInfo.email = email;
    if (phone !== undefined) contactInfo.phone = phone;
    if (address !== undefined) contactInfo.address = address;
    if (officeHours !== undefined) contactInfo.officeHours = officeHours;

    await contactInfo.save();

    res.json({
      message: 'Contact information updated successfully',
      contactInfo: {
        email: contactInfo.email,
        phone: contactInfo.phone,
        address: contactInfo.address,
        officeHours: contactInfo.officeHours
      }
    });
  } catch (error) {
    console.error('Update contact info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, service, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        message: 'Name, email, and message are required fields.',
        success: false 
      });
    }

    // Here you would typically save to database or send email
    console.log('Contact form submission:', { 
      name, 
      email, 
      phone: phone || 'Not provided',
      company: company || 'Not provided',
      service: service || 'Not provided',
      message 
    });

    res.json({ 
      message: 'Thank you for your message! We will get back to you soon.',
      success: true 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      message: 'Server error. Please try again later.',
      success: false 
    });
  }
});

module.exports = router;
