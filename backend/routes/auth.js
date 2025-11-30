const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Student Registration
router.post('/student/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const user = new User({ name, email, password, role: 'student' });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: { userId: user._id, email: user.email }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Create Admin (temporary endpoint)
router.post('/create-admin', async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(409).json({ success: false, message: 'Admin already exists' });
    }

    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: { email: 'admin@example.com', password: 'admin123' }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check MongoDB connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database connection unavailable' });
    }
    
    const user = await User.findOne({ email }).maxTimeMS(5000);
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    if (error.name === 'MongooseError' || error.name === 'MongoTimeoutError') {
      return res.status(503).json({ success: false, message: 'Database timeout - please try again' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;