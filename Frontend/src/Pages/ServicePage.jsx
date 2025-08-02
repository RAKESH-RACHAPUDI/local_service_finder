import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../Components/SearchBar";
import ServiceCard from "../Components/ServiceCard";

const ServicePage = () => {
  const [services, setServices] = useState([]); // ✅ Default to empty array

  useEffect(() => {
    fetchDefaultServices();
  }, []);

  const fetchDefaultServices = async () => {
    try {
      const res = await axios.get("/api/services");
      if (res.data && Array.isArray(res.data.services)) {
        setServices(res.data.services); // ✅ only set if it's a valid array
      } else {
        setServices([]); // fallback to empty
        console.warn("⚠️ Response is not an array:", res.data);
      }
    } catch (error) {
      console.error("❌ Error loading default services:", error);
      setServices([]); // on error, still make sure it's an array
    }
  };

  const handleSearch = async ({ query, location }) => {
    try {
      const res = await axios.post("/api/services", { query, location });
      if (res.data && Array.isArray(res.data.services)) {
        setServices(res.data.services);
      } else {
        setServices([]);
        console.warn("⚠️ Search response is not an array:", res.data);
      }
    } catch (error) {
      console.error("❌ Search error:", error);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">
        Find Local Services Near You
      </h1>

      <SearchBar onSearch={handleSearch} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {Array.isArray(services) && services.length > 0 ? (
          services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No services found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ServicePage;
