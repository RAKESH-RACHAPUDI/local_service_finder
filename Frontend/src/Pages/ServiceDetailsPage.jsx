import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookingModal from "../components/BookingModal";

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`/api/services/${id}`);
        setService(res.data.service);
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };
    fetchService();
  }, [id]);

  if (!service)
    return <div className="text-center py-20">Loading service......</div>;

  return (
    <>
      <div className="max-w-5xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <img
            src={service.image || "/default-service.jpg"}
            alt={service.name}
            className="w-full h-80 object-cover rounded-xl"
          />
          <div>
            <h2 className="text-3xl font-bold mb-2">{service.name}</h2>
            <p className="text-gray-600 mb-2">{service.category}</p>
            <p className="text-lg text-gray-800 mb-4">{service.description}</p>
            <p className="text-xl font-semibold text-blue-600">₹{service.price}</p>

            <button
              onClick={() => setShowModal(true)}
              className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <BookingModal service={service} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default ServiceDetailsPage