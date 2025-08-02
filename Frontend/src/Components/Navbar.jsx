import { message, Modal, Input, Button } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../Utils/axios";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [tokenData, setTokenData] = useState({ token: null, providerId: null });
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const routeToken = location?.state?.token;
    const providerId = location?.state?.providerId;

    if (routeToken && providerId) {
      setTokenData({ token: routeToken, providerId });
    }
  }, [location]);

  const isLoggedIn = !!tokenData.token;

  const handleProtectedClick = (path) => {
    if (isLoggedIn) {
      navigate(path, { state: tokenData });
    } else {
      message.warning("⚠️ Please login to access this page.");
      navigate("/provider/login");
    }
  };

  const handleLogout = () => {
    setTokenData({ token: null, providerId: null });
    message.success("✅ Logged out successfully.");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleSendLink = async () => {
    if (!email) {
      message.warning("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/provider/send-link", { email });
      message.success("✅ Registration link sent to your email.");
      setShowEmailModal(false);
      setEmail("");
    } catch (err) {
      message.error(
        err?.response?.data?.message || "❌ Failed to send registration link."
      );
    }
    setLoading(false);
  };

  const handleUserLogin = () => {
    const userRegistered = localStorage.getItem("user_registered"); // dummy check
    if (!userRegistered) {
      message.error("🚫 Please register first before logging in.");
      return;
    }
    navigate("/user/login");
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "linear-gradient(to right, #ffffff, #e0f7fa)",
        padding: "0 20px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        fontFamily: "'Segoe UI', sans-serif",
        height: "55px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
        }}
      >
        {/* Logo */}
        <div style={{ cursor: "pointer" }} onClick={() => handleProtectedClick("/")}>
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "700",
              color: "#00796b",
              letterSpacing: "0.5px",
            }}
          >
            SmartServeAI
          </h2>
        </div>

        {/* Right Side Nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: "15px",
          }}
        >
          <div style={{ cursor: "pointer", color: "#333" }} onClick={() => handleProtectedClick("/")}>
            Home
          </div>

          {/* ✅ Updated: Public Services Route */}
          <div style={{ cursor: "pointer", color: "#333" }} onClick={() => navigate("/services")}>
            Services
          </div>

          {!isLoggedIn ? (
            <>
              {/* 🟢 Provider */}
              <Link to="/provider/login" style={{ color: "#d45a1dff", textDecoration: "none" }}>
                Provider Login
              </Link>
              <Button type="link" style={{ color: "#1d7ad4", textDecoration: "none", padding: 0 }}
                onClick={() => setShowEmailModal(true)}>
                Register as Provider
              </Button>

              {/* 🟢 User */}
              <Button type="link" onClick={handleUserLogin} style={{ color: "#4caf50", padding: 0 }}>
                User Login
              </Button>
              <Link to="/user/register" style={{ color: "#4caf50", textDecoration: "none" }}
                onClick={() => localStorage.setItem("user_registered", true)}>
                Register as User
              </Link>
            </>
          ) : (
            <>
              <div style={{ cursor: "pointer", color: "#333" }} onClick={() => handleProtectedClick("/provider/dashboard")}>
                Dashboard
              </div>
              <div style={{ cursor: "pointer", color: "#d32f2f" }} onClick={handleLogout}>
                Logout
              </div>
            </>
          )}
        </div>
      </div>

      {/* Provider Register Modal */}
      <Modal
        title="Provider Registration"
        open={showEmailModal}
        onCancel={() => setShowEmailModal(false)}
        onOk={handleSendLink}
        okText="Send Link"
        confirmLoading={loading}
      >
        <Input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onPressEnter={handleSendLink}
        />
      </Modal>
    </div>
  );
};

export default Navbar;
