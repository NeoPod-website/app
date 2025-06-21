import React from "react";

import AdminAuth from "@/components/layout/auth/AdminAuth";

export const metadata = {
  title: "Admin Panel | NeoPod",
  description:
    "Internal admin dashboard for managing NeoPod ambassadors and communities.",

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
