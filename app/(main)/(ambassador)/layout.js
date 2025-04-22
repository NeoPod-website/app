import React from "react";

import DashboardSidebar from "@/components/common/sidebar/DashboardSidebar";

import { ambassadorMenuItems } from "@/data/sidebarMenuItem";

const AdminLayout = async ({ children }) => {
  return (
    <>
      <DashboardSidebar menuItems={ambassadorMenuItems} />

      <main>{children}</main>
    </>
  );
};

export default AdminLayout;
