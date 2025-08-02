import { useState, useEffect } from "react";
import axios from "../Utils/axios"; // ✅ Use your custom axios instance

const BookingModal = ({ service, onClose }) => {
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  // 🔐 Safety check: if service is undefined, don’t render
  if (!service) {
    return null;
  }

  const handleBooking = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("⚠️ Please login before booking.");
        return;
      }

      const bookingData = {
        userId,
        providerId: service._id,
        serviceName: service.name,
        date,
        notes,
      };

      const res = await axios.post("/api/bookings", bookingData); // Use relative URL

      if (res.data.success) {
        alert("✅ Booking Successful!");
        onClose();
      } else {
        alert("❌ Booking Failed.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("⚠️ Something went wrong while booking.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl animate-fade-in">
        <h2 className="text-2xl font-bold mb-4">Book {service?.name}</h2>

        <label className="block mb-2 text-sm font-medium">Choose Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mb-4 p-2 border rounded-lg"
        />

        <label className="block mb-2 text-sm font-medium">Any Notes?</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
          rows="3"
        ></textarea>

        <div className="flex justify-between">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={handleBooking}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;