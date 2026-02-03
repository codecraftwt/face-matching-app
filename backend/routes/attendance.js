const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// POST /api/attendance - mark attendance (check-in or check-out)
router.post('/', async (req, res) => {
  try {
    const { emp_id, name } = req.body;
    if (!emp_id || !name) {
      return res.status(400).json({ error: 'emp_id and name required' });
    }
    const now = new Date();

    const openSession = await Attendance.findOne({
      emp_id,
      check_out: null,
    }).sort({ check_in: -1 });

    if (openSession) {
      const checkIn = new Date(openSession.check_in);
      const duration = Math.floor((now.getTime() - checkIn.getTime()) / 1000);
      openSession.check_out = now;
      openSession.duration = duration;
      await openSession.save();
      return res.json({ action: 'checkout', duration });
    }

    await Attendance.create({
      emp_id,
      name,
      check_in: now,
    });
    res.status(201).json({ action: 'checkin' });
  } catch (err) {
    console.error('POST /api/attendance', err);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

// GET /api/attendance - list all (for export)
router.get('/', async (req, res) => {
  try {
    const list = await Attendance.find({})
      .sort({ check_in: -1 })
      .select('emp_id name check_in check_out duration')
      .lean();
    res.json(list);
  } catch (err) {
    console.error('GET /api/attendance', err);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// GET /api/attendance/export - CSV content
router.get('/export', async (req, res) => {
  try {
    const list = await Attendance.find({})
      .sort({ check_in: -1 })
      .select('emp_id name check_in check_out duration')
      .lean();

    let csv = 'Employee ID,Name,Check-In,Check-Out,Duration (hours)\n';
    for (const row of list) {
      const hours = row.duration != null ? (row.duration / 3600).toFixed(2) : '';
      const checkIn = row.check_in ? new Date(row.check_in).toISOString() : '';
      const checkOut = row.check_out ? new Date(row.check_out).toISOString() : '';
      csv += `${row.emp_id},${row.name || ''},${checkIn},${checkOut},${hours}\n`;
    }
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance.csv');
    res.send(csv);
  } catch (err) {
    console.error('GET /api/attendance/export', err);
    res.status(500).json({ error: 'Failed to export' });
  }
});

module.exports = router;
