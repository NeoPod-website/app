import React from "react";

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

const AdminLayout = async ({ children }) => {
  return <>{children}</>;
};

export default AdminLayout;
