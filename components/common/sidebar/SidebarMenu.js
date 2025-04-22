import React from "react";

import SidebarMenuItem from "./SidebarMenuItem";

const SidebarMenu = ({ menuItems }) => {
  return (
    <nav className="flex-1 space-y-1 overflow-auto">
      {menuItems.map((item, index) => (
        <SidebarMenuItem key={`menu-item-${index}`} index={index} item={item} />
      ))}
    </nav>
  );
};

export default SidebarMenu;
