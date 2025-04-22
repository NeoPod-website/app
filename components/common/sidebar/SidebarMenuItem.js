"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import SidebarAccordion from "./SidebarAccordion";

const SidebarMenuItem = ({ index, item }) => {
  const pathname = usePathname();
  const isActive = item.href === pathname;

  return (
    <div>
      {item.children ? (
        <SidebarAccordion index={index} item={item} isActive={isActive} />
      ) : (
        <Link
          href={item.href}
          className={`sidebar-menu-item border border-transparent text-gray-100 ${isActive ? "!bg-gray-500 text-white hover:!border-white hover:!bg-transparent" : ""}`}
        >
          <span className="mr-4">{item.icon}</span>
          {item.name}
        </Link>
      )}
    </div>
  );
};

export default SidebarMenuItem;
