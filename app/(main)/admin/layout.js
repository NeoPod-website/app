import React from "react";

import AuthProvider from "@/providers/AuthProvider";

const AdminLayout = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AdminLayout;
