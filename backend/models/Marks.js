const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  internal: { type: Number, required: true },
  external: { type: Number, required: true },
  total: { type: Number, required: true }
});

const marksSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subjects: [subjectSchema],
  percentage: { type: Number, required: true },
  grade: { type: String, required: true },
  status: { type: String, enum: ['pass', 'fail'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Marks', marksSchema);