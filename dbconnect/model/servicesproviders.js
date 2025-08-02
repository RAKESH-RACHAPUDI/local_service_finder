const mongoose = require('mongoose');
const serviceproviderSchema = new mongoose.Schema({
    name: String,
    category: String,
    description: String,
    rating: { type: Number, default: 0 },
    location: String,
    image: String,
    available: { type: Boolean, default: true },
    phone: String,
    email: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('serviceProvider', serviceproviderSchema);