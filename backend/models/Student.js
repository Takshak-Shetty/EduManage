const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  enrollmentNumber: { type: String, required: true, unique: true },
  address: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);