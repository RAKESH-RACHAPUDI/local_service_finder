const mongoose = require('mongoose');

const ProviderSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Enter valid phone number"],
  },

  profession: {
    type: String,
    required: true,
    enum: ["Electrician", "Plumber", "Watchman", "Room Cleaner", "Others"],
  },

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },

  isVerified: {
    type: Boolean,
    default: false,
  }

}, { timestamps: true });

module.exports = mongoose.model("Providers", ProviderSchema);
