import { useEffect, useState } from "react";
import axios from "axios";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const res = await axios.get(`http://localhost:5000/api/bookings/user/${userId}`);
        setBookings(res.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings(); // ✅ Fixed typo
  }, []);

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">📒 My Bookings</h1>

        {bookings.length === 0 ? (
          <p className="text-gray-600">You have no bookings yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white shadow-md rounded-xl p-4 border hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold mb-2">{booking.serviceName}</h2>
                <p className="text-gray-600">
                  🗓️ Date:{" "}
                  {new Date(booking.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-gray-600">📝 Notes: {booking.notes || "None"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyBookingsPage;
