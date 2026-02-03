require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const employeeRoutes = require('./routes/employees');
const attendanceRoutes = require('./routes/attendance');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);

// All app data is stored in MongoDB (db: face_attendance, collections: employees, attendances)
const DB_NAME = 'face_attendance';

app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.json({
    ok: true,
    db: dbState === 1 ? 'connected' : dbState === 0 ? 'disconnected' : 'connecting',
  });
});

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('Missing MONGO_URI in .env');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, { dbName: DB_NAME })
  .then(() => {
    console.log(`MongoDB connected (database: ${DB_NAME})`);
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`On your network: http://<YOUR_PC_IP>:${PORT} (use this in the app on physical device)`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
