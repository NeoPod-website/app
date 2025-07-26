import React from "react";

import SidebarMenu from "../SidebarMenu";
import BurgerMenuButton from "./BurgerMenuButton";
import BurgerMenuOverlayWrapper from "./BurgerMenuOverlayWrapper";

import SidebarSocial from "../SidebarSocial";
import SidebarProfileContainer from "../SidebarProfileContainer";
import SidebarMenuItem from "../SidebarMenuItem";

const MobileBurgerMenu = ({ menuItems }) => {
  return (
    <div className="md:hidden">
      <BurgerMenuButton />

      <BurgerMenuOverlayWrapper>
        <div className="flex h-[calc(100%-80px)] flex-col">
          <nav className="thin-scrollbar flex-1 space-y-1 overflow-y-auto px-4 py-6">
            {menuItems.map((item, index) => (
              <SidebarMenuItem
                key={`menu-item-${index}`}
                index={index}
                item={item}
              />
            ))}
          </nav>

          <div className="space-y-4 border-t border-gray-700 p-4">
            <SidebarSocial />
            <SidebarProfileContainer />
          </div>
        </div>
      </BurgerMenuOverlayWrapper>
    </div>
  );
};

export default MobileBurgerMenu;
