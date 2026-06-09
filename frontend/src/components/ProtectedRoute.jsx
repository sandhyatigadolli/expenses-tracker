// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    // User is not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }
  // User is logged in, render children components
  return children;
};

export default ProtectedRoute;
