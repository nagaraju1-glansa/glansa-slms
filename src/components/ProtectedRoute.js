// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const roleId = localStorage.getItem('RoleId');

  // If role is not allowed, redirect to dashboard
  if (!allowedRoles.includes(Number(roleId))) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
