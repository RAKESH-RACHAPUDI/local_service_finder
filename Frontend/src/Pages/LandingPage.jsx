import { Card, Col, Row, Typography, Button, Rate } from "antd";
import Services from "../Data/Services";

const { Title, Paragraph } = Typography;

const LandingPage = () => {
  const handleServiceClick = () => {
    alert("Checking login status...");
  };

  return (
    <div style={{ padding: "40px", background: "#f9fafb" }}>
      {/* Heading */}
      <Title level={2} style={{ textAlign: "center", color: "#1e3a8a" }}>
        Welcome to SmartServeAI
      </Title>

      {/* Subheading */}
      <Paragraph
        style={{
          textAlign: "center",
          maxWidth: 800,
          margin: "auto",
          color: "brown",
          fontSize:18,
        }}
      >
        Discover trusted local service providers near you using AI-powered
        recommendations. <br />
        Book electricians, plumbers, cleaners, and more based on ratings and
        availability.
      </Paragraph>

      {/* Service Cards */}
      <Row gutter={[24, 24]} justify="center" style={{ marginTop: 40 }}>
        {Services.map((service) => (
          <Col xs={24} sm={12} md={6} key={service.id}>
            <div
              style={{
                transition: "transform 0.3s, box-shadow 0.3s",
                borderRadius: "12px",
              }}
              className="hover-card"
            >
              <Card
                hoverable
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "transform 0.3s",
                }}
                cover={
                  <div
                    className="image-container"
                    style={{
                      overflow: "hidden",
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px",
                    }}
                  >
                    <img
                      alt={service.title}
                      src={service.image}
                      className="service-image"
                      style={{
                        height: 180,
                        objectFit: "cover",
                        width: "100%",
                        transition: "transform 0.4s ease",
                      }}
                    />
                  </div>
                }
              >
                <Card.Meta
                  title={
                    <span style={{ fontWeight: 600, color: "#111827" }}>
                      {service.title}
                    </span>
                  }
                  description={
                    <>
                      <p
                        style={{
                          marginTop: 8,
                          color: "#4b5563",
                          fontSize: 13,
                        }}
                      >
                        {service.description}
                      </p>

                      {/* Star Rating */}
                      <Rate
                        disabled
                        defaultValue={service.rating}
                        allowHalf
                        style={{ fontSize: 14 }}
                      />

                      {/* Book Now Button */}
                      <div style={{ marginTop: 12, textAlign: "center" }}>
                        <Button
                          type="primary"
                          onClick={handleServiceClick}
                          style={{
                            backgroundColor: "#1e40af",
                            borderRadius: "5px",
                            padding: "4px 12px",
                            height: "30px",
                            fontSize: "12px",
                            fontWeight: 500,
                            width: "120px",
                            transition: "background-color 0.3s",
                          }}
                          className="hover-button"
                        >
                          Book Now
                        </Button>
                      </div>
                    </>
                  }
                />
              </Card>
            </div>
          </Col>
        ))}
      </Row>

      {/* Hover Styles */}
      <style>
        {`
          .hover-card:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          }

          .hover-card:hover .service-image {
            transform: scale(1.1);
          }

          .hover-button:hover {
            background-color: #2563eb !important;
          }
        `}
      </style>
    </div>
  );
};

export default LandingPage;
