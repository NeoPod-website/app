import React from "react";

import AuthProvider from "@/providers/AuthProvider";

const DashboardLayout = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default DashboardLayout;
