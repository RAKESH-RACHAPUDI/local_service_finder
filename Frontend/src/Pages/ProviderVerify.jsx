import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../Utils/axios";
import { message } from "antd";

const ProviderVerify = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !email) {
        message.error("⛔ Token or Email missing");
        navigate("/");
        return;
      }

      try {
        // ✅ Changed to GET with query parameters
        const res = await axios.get(`/provider/verify-token?token=${token}&email=${email}`);

        if (res.data.valid) {
          message.success("✅ Link verified successfully");
          navigate(`/provider/register?token=${token}&email=${email}`);
        } else {
          message.error(res.data.message || "❌ Invalid or expired token");
          navigate("/provider/login");
        }
      } catch (err) {
        message.error("⚠️ Server error during verification");
        navigate("/provider/login");
      }
    };

    verifyToken();
  }, [token, email, navigate]);

  return (
    <p style={{ textAlign: "center", marginTop: "50px" }}>
      🔄 Verifying token, please wait...
    </p>
  );
};

export default ProviderVerify;
