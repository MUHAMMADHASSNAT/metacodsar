const express = require('express');
const router = express.Router();

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