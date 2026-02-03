const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const employeeRoutes = require('./routes/employees');
const attendanceRoutes = require('./routes/attendance');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.json({
    ok: true,
    db: dbState === 1 ? 'connected' : dbState === 0 ? 'disconnected' : 'connecting',
  });
});

module.exports = app;
