
const Booking = require('../model/BookingModel')
const getProviderBookings = async (req, res) => {
  try {
    const providerId = req.provider.id; // From verified token

    const bookings = await Booking.find({ providerId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Provider bookings fetch error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
module.exports={getProviderBookings}
