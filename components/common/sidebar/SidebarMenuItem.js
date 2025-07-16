"use client";

import React from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";

import SidebarAccordion from "./SidebarAccordion";
import InboxButton from "@/components/layout/ambassadors/inbox/InboxButton";

const SidebarMenuItem = ({ index, item }) => {
  const pathname = usePathname();

  const isActive = item.href === pathname;

  if (item.href === "/inbox") {
    return <InboxButton item={item} />;
  }

  return (
    <div>
      {item.children ? (
        <SidebarAccordion index={index} item={item} isActive={isActive} />
      ) : (
        <Link
          href={item.href}
          title={item.name}
          aria-current={isActive ? "page" : undefined}
          className={`sidebar-menu-item scale-100 border border-transparent text-gray-100 transition-all active:scale-95 ${isActive ? "!bg-gray-500 text-white hover:!border-white hover:!bg-transparent" : ""}`}
        >
          <span className="mr-3 2xl:mr-4">{item.icon}</span>
          <span className="text-sm md:hidden xl:inline 3xl:text-base">
            {item.name}
          </span>
        </Link>
      )}
    </div>
  );
};

export default SidebarMenuItem;
