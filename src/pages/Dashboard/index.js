import React from "react";
import CompanyDashboard from "./CompanyDashboard";
import MemberDashboard from "./MemberDashboard";
import GlansaDashboard from "./GlansaDashboard";
import { RoleId } from '../ApiConfig/ApiConfig';

const Dashboard = () => {
  const roleId = RoleId();

  if (roleId == 'Member') {
    // Company user
    return <MemberDashboard />;
  }
  else if (roleId == '0') {
    // Member user
    return <GlansaDashboard />;
  }
   else {
    // Member user
    return <CompanyDashboard />;
  }
};

export default Dashboard;
