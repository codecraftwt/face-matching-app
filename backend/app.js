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
  const dbStatus = dbState === 1 ? 'connected' : dbState === 0 ? 'disconnected' : 'connecting';
  res.json({
    ok: true,
    db: dbStatus,
    hint: dbState === 0 ? 'Set MONGO_URI in Vercel env vars; allow 0.0.0.0/0 in MongoDB Atlas Network Access' : undefined,
  });
});

module.exports = app;
