import React, { useState } from 'react';
import axios from '../Utils/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function UserRegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();

  // ✅ Send OTP function with validations
 // ✅ Send OTP
const sendOTP = async () => {
  if (!formData.email) return toast.error("Please enter your email");
  try {
    const res = await axios.post('/otp/send-otp', { email: formData.email });
    toast.success('OTP sent to email!');
    setOtpSent(true);
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Error sending OTP';
    toast.error(errorMsg);
  }
};

// ✅ Verify OTP
const verifyOTP = async () => {
  try {
    const res = await axios.post('/otp/verify-otp', { email: formData.email, otp });
    if (res.data.message === "OTP verified successfully") {
      setOtpVerified(true);
      toast.success('OTP verified!');
    } else {
      toast.error('Invalid OTP');
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'OTP verification failed';
    toast.error(errorMsg);
  }
};

// ✅ Register
const handleRegister = async (e) => {
  e.preventDefault();
  if (!otpVerified) return toast.error('Please verify OTP first');
  try {
    await axios.post('/users/register', formData);
    toast.success('Registered successfully');
    navigate('/login');
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Registration failed';
    toast.error(errorMsg);
  }
};


  return (
    <>
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          {!otpSent && (
            <button type="button" onClick={sendOTP}>
              Send OTP
            </button>
          )}

          {otpSent && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button type="button" onClick={verifyOTP}>
                Verify OTP
              </button>
            </>
          )}

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <button type="submit" disabled={!otpVerified}>
            Register
          </button>
        </form>
      </div>
    </>
  );
}

export default UserRegisterPage;
