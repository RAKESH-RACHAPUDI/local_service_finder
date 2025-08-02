import '@ant-design/v5-patch-for-react-19';
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, message, Spin } from 'antd';
import axios from '../Utils/axios'; // ✅ Your custom axios instance
import { useLocation, useNavigate } from 'react-router-dom';

const ProviderRegistrationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Step 1: On load, extract token & email from URL and verify
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromURL = queryParams.get("token");
    const emailFromURL = queryParams.get("email");

    if (!tokenFromURL || !emailFromURL) {
      message.error("❌ Token or Email is missing. Please use the proper link from your email.");
      navigate("/");
      return;
    }

    setToken(tokenFromURL);
    setEmail(emailFromURL);

    // ✅ Step 2: Call backend to verify token
    axios
      .get(`/provider/verify-token?token=${tokenFromURL}&email=${emailFromURL}`)
      .then((res) => {
        if (res.data.valid) {
          setTokenValid(true);
        } else {
          message.error("❌ Invalid or expired token. Please request a new one.");
          navigate("/");
        }
      })
      .catch(() => {
        message.error("❌ Token validation failed.");
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [location.search, navigate]);

  // ✅ Step 3: Submit registration form
  const onFinish = async (values) => {
    const { fullName, phoneNumber, serviceType, password } = values;
    setSubmitting(true);
    try {
      const payload = {
        name: fullName,
        phone: phoneNumber,
        profession: serviceType,
        password,
        token,
        email,
      };

      const res = await axios.post("/provider/register", payload);

      if (res.data.success) {
        message.success("🎉 Provider registered successfully!");
        navigate("/provider/login");
      } else {
        message.error(res.data.message || "⚠️ Registration failed.");
      }
    } catch (err) {
      message.error(err.response?.data?.message || "⚠️ Server error occurred.");
    }
    setSubmitting(false);
  };

  // ✅ Show loading spinner while verifying
  if (loading) return <Spin tip="Validating token..." style={{ marginTop: 100 }} />;

  // ✅ If token is invalid, return null
  if (!tokenValid) return null;

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: "2rem" }}>
      <h2 style={{ textAlign: "center" }}>Provider Registration</h2>

      <div style={{ marginBottom: '1rem', fontWeight: 'bold', color: '#333' }}>
        Registering with email: <span style={{ color: '#1677ff' }}>{email}</span>
      </div>

      <Form
        name="register"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ serviceType: 'Watchman' }}
        disabled={submitting}
      >
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[{ required: true, message: 'Please input your full name!' }]}
        >
          <Input placeholder="John Doe" />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[
            { required: true, message: 'Please input your phone number!' },
            { pattern: /^[0-9]{10}$/, message: 'Enter valid 10-digit number' }
          ]}
        >
          <Input placeholder="9876543210" />
        </Form.Item>

        <Form.Item
          name="serviceType"
          label="Service Type"
          rules={[{ required: true, message: 'Please select a service type!' }]}
        >
          <Select placeholder="Select profession">
            <Select.Option value="Watchman">Watchman</Select.Option>
            <Select.Option value="Electrician">Electrician</Select.Option>
            <Select.Option value="Plumber">Plumber</Select.Option>
            <Select.Option value="Cleaner">Cleaner</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
        >
          <Input.Password placeholder="********" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="********" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={submitting}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProviderRegistrationPage;
