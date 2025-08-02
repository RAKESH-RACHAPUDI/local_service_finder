const getBookingsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const bookings = await Booking.find({ userId }).populate("providerId");

    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to fetch bookings", error: err.message });
  }
};
module.exports={getBookingsByUser};