import React from "react";

import SidebarMenuItem from "./SidebarMenuItem";

const SidebarMenu = ({ menuItems }) => {
  return (
    <nav className="thin-scrollbar flex-1 space-y-1 overflow-y-auto pr-1">
      {menuItems.map((item, index) => (
        <SidebarMenuItem key={`menu-item-${index}`} index={index} item={item} />
      ))}
    </nav>
  );
};

export default SidebarMenu;
