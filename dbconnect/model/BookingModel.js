const mongoose= require('mongoose')
const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceProvider"
  },
  serviceName: String,  // optional, if you want it again
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending"
  },
  date: Date,
  notes: String,             // from the booking modal (optional)
  location: String           // from user input (optional)
});

module.exports = mongoose.model("Booking",BookingSchema);