import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import axios from "../Utils/axios";

const MailPage = () => {
  const onFinish = async (values) => {
    try {
      const res = await axios.post("/provider/send-link", values);

      if (res.data.success) {
        message.success(res.data.message || "📧 Link sent successfully!");
      } else {
        message.error(res.data.message || "❌ Failed to send verification link");
      }
    } catch (err) {
      console.log("Axios Error:", err);

      if (err.code === "ERR_NETWORK") {
        message.error("❌ Cannot connect to the server. Please start your backend.");
      } else {
        message.error(
          err.response?.data?.message || "❌ Failed to send verification link"
        );
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        background: "#f0f2f5",
      }}
    >
      <Card
        title="Register as Service Provider"
        style={{
          width: 400,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderRadius: "10px",
        }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Send Verification Link
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default MailPage;
