const express = require('express');
const Student = require('../models/Student');
const Marks = require('../models/Marks');
const User = require('../models/User');
const { auth, studentAuth } = require('../middleware/auth');
const router = express.Router();

router.use(auth, studentAuth);

// Get Student Profile
router.get('/profile', async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.user.email });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get Student Scorecard
router.get('/scorecard', async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.user.email });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const marks = await Marks.findOne({ studentId: student._id });
    if (!marks) {
      return res.status(404).json({ success: false, message: 'Scorecard not found' });
    }

    res.json({ success: true, data: { student, marks } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;