const getBookingCount = async (req, res) => {
  const { userId } = req.params;

  try {
    const count = await Booking.countDocuments({ userId });
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
module.exports = {getBookingCount}; 