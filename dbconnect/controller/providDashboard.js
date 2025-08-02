const Booking = require("../model/BookingModel");

const getProviderDashboard = async (req, res) => {
  try {
    // Extract the providerId from the request object
    const providerId = req.Provider_id;

    // Validate providerId - Ensure the providerId exists
    if (!providerId) {
      return res.status(400).json({ success: false, message: "Provider ID is missing" });
    }

    // Fetch booking counts and services using aggregation for bookings
    const bookingsCount = await Booking.aggregate([
      { $match: { providerId } }, // Match the providerId in the bookings
      { $group: {
        _id: null,
        totalBookings: { $sum: 1 }, // Total bookings for the provider
        pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } }, // Pending bookings
        accepted: { $sum: { $cond: [{ $eq: ["$status", "Accepted"] }, 1, 0] } }, // Accepted bookings
        rejected: { $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] } } // Rejected bookings
      }}
    ]);

    // Destructure the result and set defaults to 0 if no bookings are found
    const { totalBookings = 0, pending = 0, accepted = 0, rejected = 0 } = bookingsCount[0] || {};

    // Fetch provider details (including services) from the request
    const services = req.Provider?.services || [];  // Handle if services are missing

    // Ensure the provider exists in the request (check if req.Provider is populated)
    if (!req.Provider) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    // Prepare the response data
    const responseData = {
      success: true,
      data: {
        totalBookings,
        pending,
        accepted,
        rejected,
        services: services.length ? services : ["No services available"], // Default if no services exist
        providerName: req.Provider?.name || "Provider Name Not Available", // Default if name is missing
      },
    };

    // Send the response with the provider dashboard data
    res.status(200).json(responseData);

  } catch (err) {
    console.error("Dashboard Error:", err.stack);
    
    // Handle specific MongoDB errors or generic error
    if (err.name === 'MongoError') {
      return res.status(500).json({ success: false, message: "Database Error: " + err.message });
    }

    // Generic error response
    res.status(500).json({ success: false, message: "An error occurred while fetching the dashboard data" });
  }
};

module.exports = { getProviderDashboard };
