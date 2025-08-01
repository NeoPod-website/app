import React from "react";

import SidebarMenuItem from "./SidebarMenuItem";

const SidebarMenu = ({ menuItems, role }) => {
  return (
    <nav className="thin-scrollbar flex-1 space-y-1 overflow-y-auto pr-1">
      {menuItems.map((item, index) => (
        <SidebarMenuItem
          role={role}
          item={item}
          index={index}
          key={`menu-item-${index}`}
        />
      ))}
    </nav>
  );
};

export default SidebarMenu;
