import React from "react";

import SidebarMenu from "./SidebarMenu";
import SidebarSocial from "./SidebarSocial";
import SidebarProfileContainer from "./SidebarProfileContainer";

import { LogoWithText } from "@/components/ui/Logo";

const DashboardSidebar = ({ menuItems }) => {
  return (
    <section className="flex max-w-sm flex-1 flex-col space-y-14 bg-black/50 px-8 pb-7 pt-14">
      <LogoWithText />

      <SidebarMenu menuItems={menuItems} />

      <div className="space-y-5">
        <SidebarSocial />
        <SidebarProfileContainer />
      </div>
    </section>
  );
};

export default DashboardSidebar;
