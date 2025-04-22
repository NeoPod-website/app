import React from "react";

import DashboardSidebar from "@/components/common/sidebar/DashboardSidebar";

import { ambassadorMenuItems } from "@/data/sidebarMenuItem";

const MainLayout = async ({ children }) => {
  return (
    <div className="flex h-screen bg-[url('/hero-background.png')] bg-cover">
      <DashboardSidebar menuItems={ambassadorMenuItems} />

      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
