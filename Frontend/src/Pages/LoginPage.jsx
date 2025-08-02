import React, { useState } from 'react';
import axios from '../Utils/axios'; // Make sure this has baseURL = 'http://localhost:5000/api'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function UserLoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // ✅ Corrected endpoint
      const res = await axios.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default UserLoginPage;
