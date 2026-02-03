const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  emp_id: { type: String, required: true },
  name: { type: String, required: true },
  check_in: { type: Date, required: true },
  check_out: { type: Date, default: null },
  duration: { type: Number, default: null }, // seconds
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
