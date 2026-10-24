// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) throw new Error('MONGO_URL is not set in environment');
    const dbName = process.env.DB_NAME || 'internship_tracker';
    // include dbName into connection string if not provided
    const finalUrl = mongoUrl.includes('?') ? `${mongoUrl}` : `${mongoUrl}`;
    await mongoose.connect(finalUrl, {
      dbName,
      autoIndex: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
