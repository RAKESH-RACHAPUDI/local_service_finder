
const Booking = require('../model/BookingModel');

const createBooking = async (req, res) => {
  const { userId, providerId, serviceName, date, notes, location } = req.body;

  try {
    const newBooking = new Booking({
      userId,
      providerId,
      serviceName,
      date,
      notes,
      location
    });

    await newBooking.save();

    res.status(201).json({ success: true, booking: newBooking });
  } catch (err) {
    res.status(500).json({ success: false, message: "Booking failed", error: err.message });
  }
};
module.exports={createBooking};