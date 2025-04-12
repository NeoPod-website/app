import React from "react";

import AdminAuth from "@/components/layout/auth/AdminAuth";

export const metadata = {
  title: "Admin Panel | NEO POD",
  description:
    "Internal admin dashboard for managing Neo Pod ambassadors and communities.",

  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const AdminLoginPage = () => {
  return <AdminAuth />;
};

export default AdminLoginPage;
