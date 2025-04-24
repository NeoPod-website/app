import React from "react";

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

const AdminLayout = async ({ children }) => {
  return <>{children}</>;
};

export default AdminLayout;
