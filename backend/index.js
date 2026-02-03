// Vercel serverless entry: connect MongoDB and export Express app
const mongoose = require('mongoose');
const app = require('./app');

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'face_attendance';

if (MONGO_URI) {
  mongoose.connect(MONGO_URI, { dbName: DB_NAME }).catch((err) => console.error('MongoDB connect:', err));
}

module.exports = app;
