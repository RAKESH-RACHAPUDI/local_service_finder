import {
  Button,
  Card,
  Col,
  message,
  Row,
  Spin,
  Typography,
  Tag,
} from "antd";
import axios from "../Utils/axios";
import {
  BarChart2,
  CheckCircle,
  Clock,
  XCircle,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

// ✅ Dashboard Card
const DashboardCard = ({ icon, title, value, color }) => (
  <Card
    style={{
      borderRadius: 12,
      boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
      textAlign: "center",
      height: "100%",
    }}
  >
    <div style={{ fontSize: 24, color, marginBottom: 8 }}>{icon}</div>
    <Title level={4}>{value}</Title>
    <Text>{title}</Text>
  </Card>
);

const ProviderDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    services: [],
    requests: [],
  });

  const navigate = useNavigate();

  const token = sessionStorage.getItem("provider_token");
  const provider = JSON.parse(sessionStorage.getItem("provider_info"));

  // ✅ Logout
  const handleLogout = () => {
    sessionStorage.removeItem("provider_token");
    sessionStorage.removeItem("provider_info");
    message.success("✅ Logged out successfully");
    navigate("/");
  };

  // ✅ Fetch dashboard stats and requests
  useEffect(() => {
    if (!token) {
      message.warning("⚠️ Please login to access dashboard");
      navigate("/provider/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/provider/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const data = res.data.data;
          setStats({
            totalBookings: data.totalBookings || 0,
            pending: data.pending || 0,
            accepted: data.accepted || 0,
            rejected: data.rejected || 0,
            services: data.services || [],
            requests: data.requests || [],
          });
        } else {
          message.error(res.data.message || "Failed to fetch dashboard data");
        }
      } catch (err) {
        console.error("Error:", err);
        if (err.response?.status === 401) {
          message.warning("⚠️ Session expired. Login again.");
          sessionStorage.removeItem("provider_token");
          sessionStorage.removeItem("provider_info");
          navigate("/provider/login");
        } else {
          message.error("⚠️ Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token, navigate]);

  // ✅ Update booking status
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const res = await axios.put(
        `/provider/bookings/update/${bookingId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        message.success(`✅ Booking ${newStatus}`);
        window.location.reload(); // or re-fetch dashboard
      } else {
        message.error("❌ Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      message.error("⚠️ Couldn't update booking status");
    }
  };

  const getTagColor = (status) => {
    switch (status) {
      case "accepted":
        return "green";
      case "rejected":
        return "red";
      case "pending":
      default:
        return "orange";
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 40, position: "relative" }}>
      {/* ✅ Logout Button */}
      <div style={{ position: "absolute", right: 40, top: 40 }}>
        <Button icon={<LogOut />} type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Title level={2} style={{ textAlign: "center" }}>
        Welcome, {provider?.name || "Provider"}!
      </Title>

      {/* ✅ Dashboard Cards */}
      <Row gutter={[24, 24]} style={{ marginTop: 30 }}>
        {[
          {
            icon: <BarChart2 />,
            label: "Total Bookings",
            value: stats.totalBookings,
            color: "#1890ff",
          },
          {
            icon: <Clock />,
            label: "Pending Bookings",
            value: stats.pending,
            color: "#faad14",
          },
          {
            icon: <CheckCircle />,
            label: "Accepted Bookings",
            value: stats.accepted,
            color: "#52c41a",
          },
          {
            icon: <XCircle />,
            label: "Rejected Bookings",
            value: stats.rejected,
            color: "#f5222d",
          },
        ].map((item, i) => (
          <Col xs={24} sm={12} md={6} key={i}>
            <DashboardCard
              icon={item.icon}
              title={item.label}
              value={item.value || 0}
              color={item.color}
            />
          </Col>
        ))}
      </Row>

      {/* ✅ Provider Services */}
      <div style={{ marginTop: 40 }}>
        <Title level={4}>Your Services</Title>
        {stats.services.length ? (
          stats.services.map((s, idx) => (
            <Tag key={idx} color="blue" style={{ marginBottom: 10 }}>
              {s}
            </Tag>
          ))
        ) : (
          <Text type="secondary">No services added yet.</Text>
        )}
      </div>

      {/* ✅ Booking Requests Panel */}
      <div style={{ marginTop: 50 }}>
        <Title level={4}>Booking Requests</Title>
        {stats.requests?.length > 0 ? (
          stats.requests.map((req) => (
            <Card key={req._id} style={{ marginBottom: 20 }}>
              <p>
                <strong>Service:</strong> {req.serviceName}
              </p>
              <p>
                <strong>Customer:</strong> {req.userName}
              </p>
              <p>
                <strong>Location:</strong> {req.location}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(req.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <Tag color={getTagColor(req.status)}>{req.status}</Tag>
              </p>

              {req.status === "pending" && (
                <div style={{ marginTop: 10 }}>
                  <Button
                    type="primary"
                    onClick={() => handleStatusUpdate(req._id, "accepted")}
                    style={{ marginRight: 10 }}
                  >
                    Accept
                  </Button>
                  <Button
                    danger
                    onClick={() => handleStatusUpdate(req._id, "rejected")}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </Card>
          ))
        ) : (
          <Text type="secondary">No new booking requests.</Text>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;
