import React from "react";

import DashboardSidebar from "@/components/common/sidebar/DashboardSidebar";

import { adminMenuItems } from "@/data/sidebarMenuItem";

const AdminLayout = async ({ children }) => {
  return (
    <>
      <DashboardSidebar menuItems={adminMenuItems} />

      <main>{children}</main>
    </>
  );
};

export default AdminLayout;
