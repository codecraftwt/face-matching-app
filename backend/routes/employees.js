const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// POST /api/employees - register employee
router.post('/', async (req, res) => {
  try {
    const { emp_id, name, embedding } = req.body;
    if (!emp_id || !name || !embedding || !Array.isArray(embedding)) {
      return res.status(400).json({ error: 'emp_id, name and embedding (array) required' });
    }
    const existing = await Employee.findOne({ emp_id });
    if (existing) {
      return res.status(409).json({ error: 'EMPLOYEE_EXISTS' });
    }
    const doc = await Employee.create({ emp_id, name, embedding });
    res.status(201).json({ emp_id: doc.emp_id, name: doc.name });
  } catch (err) {
    console.error('POST /api/employees', err);
    res.status(500).json({ error: 'Failed to register employee' });
  }
});

// GET /api/employees - list all
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find({}).select('emp_id name embedding').lean();
    res.json(employees);
  } catch (err) {
    console.error('GET /api/employees', err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// GET /api/employees/count
router.get('/count', async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error('GET /api/employees/count', err);
    res.status(500).json({ error: 'Failed to get count' });
  }
});

// DELETE /api/employees/:empId
router.delete('/:empId', async (req, res) => {
  try {
    const { empId } = req.params;
    const result = await Employee.deleteOne({ emp_id: empId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/employees/:empId', err);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

module.exports = router;
