import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoutePage = ({ children }) => {
  // Only check localStorage for user dashboard protection
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Unauthorized Access. Please login first.");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoutePage;