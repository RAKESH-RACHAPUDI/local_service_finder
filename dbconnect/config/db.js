const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL); // No options needed
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.log("❌ Database connection error in db.js:", err.message);
  }
};

module.exports = connectDB;