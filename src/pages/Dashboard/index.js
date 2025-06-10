import React from "react";
import CompanyDashboard from "./CompanyDashboard";
import MemberDashboard from "./MemberDashboard";
import { RoleId } from '../ApiConfig/ApiConfig';

const Dashboard = () => {
  const roleId = RoleId();

  if (roleId == 'Member') {
    // Company user
    return <MemberDashboard />;
  } else {
    // Member user
    return <CompanyDashboard />;
  }
};

export default Dashboard;
