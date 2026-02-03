const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  emp_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  embedding: { type: [Number], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
