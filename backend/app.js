const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const employeeRoutes = require('./routes/employees');
const attendanceRoutes = require('./routes/attendance');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Wait for MongoDB to connect (needed on Vercel serverless cold start)
const waitForDb = (maxMs = 12000) => {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => resolve();
    if (mongoose.connection.readyState === 1) return done();
    mongoose.connection.once('connected', done);
    mongoose.connection.once('error', done);
    setTimeout(done, maxMs);
  });
};
app.use((req, res, next) => {
  waitForDb().then(next);
});

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
