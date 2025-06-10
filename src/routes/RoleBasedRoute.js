// src/routes/RoleBasedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const roleId = Number(localStorage.getItem("RoleId"));

  // Redirect if role not allowed
  if (!allowedRoles.includes(roleId)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleBasedRoute;
