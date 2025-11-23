const express = require('express');
const Student = require('../models/Student');
const Marks = require('../models/Marks');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

router.use(auth, adminAuth);

// Create Student
router.post('/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ success: true, message: 'Student created successfully', data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get All Students
router.get('/students', async (req, res) => {
  try {
    const { page = 1, limit = 10, department } = req.query;
    const filter = department ? { department } : {};
    
    const students = await Student.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Student.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        students,
        pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get Student by Enrollment Number
router.get('/students/:enrollmentNumber', async (req, res) => {
  try {
    const student = await Student.findOne({ enrollmentNumber: req.params.enrollmentNumber });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update Student
router.put('/students/:enrollmentNumber', async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { enrollmentNumber: req.params.enrollmentNumber },
      req.body,
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, message: 'Student updated successfully', data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete Student
router.delete('/students/:enrollmentNumber', async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ enrollmentNumber: req.params.enrollmentNumber });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Create Marks
router.post('/marks', async (req, res) => {
  try {
    const { enrollmentNumber, subjects } = req.body;
    const student = await Student.findOne({ enrollmentNumber });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const total = subjects.reduce((sum, sub) => sum + sub.total, 0);
    const percentage = (total / (subjects.length * 100)) * 100;
    const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : 'F';
    const status = percentage >= 40 ? 'pass' : 'fail';

    const marks = new Marks({ studentId: student._id, subjects, percentage, grade, status });
    await marks.save();
    res.status(201).json({ success: true, message: 'Marks created successfully', data: marks });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get Marks
router.get('/marks/:enrollmentNumber', async (req, res) => {
  try {
    const student = await Student.findOne({ enrollmentNumber: req.params.enrollmentNumber });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const marks = await Marks.findOne({ studentId: student._id });
    if (!marks) {
      return res.status(404).json({ success: false, message: 'Marks not found' });
    }

    res.json({ success: true, data: marks });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update Marks
router.put('/marks/:enrollmentNumber', async (req, res) => {
  try {
    const { subjects } = req.body;
    const student = await Student.findOne({ enrollmentNumber: req.params.enrollmentNumber });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const total = subjects.reduce((sum, sub) => sum + sub.total, 0);
    const percentage = (total / (subjects.length * 100)) * 100;
    const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : 'F';
    const status = percentage >= 40 ? 'pass' : 'fail';

    const marks = await Marks.findOneAndUpdate(
      { studentId: student._id },
      { subjects, percentage, grade, status },
      { new: true }
    );
    
    if (!marks) {
      return res.status(404).json({ success: false, message: 'Marks not found' });
    }
    
    res.json({ success: true, message: 'Marks updated successfully', data: marks });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;