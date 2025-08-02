// frontend/src/components/ProviderLogin.jsx

import React from "react";
import { Card, Form, Input, Typography, message, Button } from "antd";
import axios from "../Utils/axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const ProviderLogin = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      // Log the form values to ensure they're being captured correctly
      console.log("Form Values:", values);

      const res = await axios.post("/provider/login", values);

      // Log the response from the backend to verify the structure
      console.log("Response:", res.data);

      if (res.data.success) {
        message.success("✅ Login successful");

        // Store token and provider temporarily in sessionStorage
        sessionStorage.setItem("provider_token", res.data.token);
        sessionStorage.setItem("provider_info", JSON.stringify(res.data.provider));

        // Navigate to the dashboard with the token and provider details
        navigate("/provider/dashboard", {
          state: {
            token: res.data.token,
            provider: res.data.provider,
          },
        });
      } else {
        message.error(res.data.message || "❌ Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error.response || error); // Log error response for debugging

      // Show a user-friendly error message
      if (error.response && error.response.data) {
        message.error(`⚠️ ${error.response.data.message || "Server error during login"}`);
      } else {
        message.error("⚠️ Server error during login");
      }
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: "60px" }}>
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Provider Login
        </Title>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email or Phone"
            rules={[{ required: true, message: "Please enter your email or phone" }]}
          >
            <Input placeholder="you@example.com or 9876543210" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="************" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProviderLogin;
