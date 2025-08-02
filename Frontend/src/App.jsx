import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // ✅ Added BrowserRouter

// Pages
import LandingPage from './pages/LandingPage';
import ServicePage from './pages/ServicePage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import ProviderDashboard from './pages/ProviderDashboard';
import MailPage from './pages/MailPage';
import ProviderVerify from './pages/ProviderVerify';
import ProviderRegistrationPage from './pages/ProviderRegestrationPage';
import ProviderLogin from './pages/ProviderLogin';
import MyBookingsPage from './Pages/myBookingPage';
import UserRegisterPage from './Pages/RegisterPage';
import UserLoginPage from './Pages/LoginPage';
import DashboardPage from './Pages/DashboardPage';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Toastify
import { ToastContainer } from 'react-toastify';

function App() {
  return (
     <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/service/:id" element={<ServiceDetailsPage />} />
        <Route path="/register" element={<UserRegisterPage />} />
        <Route path="/login" element={<UserLoginPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard/user" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/provider" element={<ProtectedRoute><ProviderDashboard /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />

        {/* Provider Flow */}
        <Route path="/register/provider" element={<MailPage />} />
        <Route path="/provider/verify" element={<ProviderVerify />} />
        <Route path="/provider/register" element={<ProviderRegistrationPage />} />
        <Route path="/provider/login" element={<ProviderLogin />} />
      </Routes>

      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;