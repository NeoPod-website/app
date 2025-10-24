import React from "react";

import SidebarSocial from "./SidebarSocial";
import DashboardSidebarClient from "./DashboardSidebarClient";
import SidebarProfileContainer from "./SidebarProfileContainer";

import { LogoWithText } from "@/components/ui/Logo";

const DashboardSidebar = ({ menuItems, session }) => {
  return (
    <section className="hidden max-w-20 flex-1 flex-col space-y-10 overflow-x-hidden rounded-r-2xl border-r border-gray-700 bg-black/50 px-3 py-8 md:flex xl:max-w-64 2xl:max-w-80 2xl:px-6 2xl:py-6 3xl:max-w-sm 3xl:space-y-14 3xl:px-8 3xl:pt-14">
      <LogoWithText className="mx-auto h-10 w-10 xl:mx-0 3xl:h-12 3xl:w-12" />

      <DashboardSidebarClient menuItems={menuItems} session={session} />

      <div className="hidden space-y-4 xl:block 3xl:space-y-5">
        <SidebarSocial />
        <SidebarProfileContainer session={session} />
      </div>
    </section>
  );
};

export default DashboardSidebar;
