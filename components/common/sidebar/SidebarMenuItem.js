"use client";

import React from "react";
import Link from "next/link";

import { useDispatch } from "react-redux";
import { usePathname } from "next/navigation";

import SidebarAccordion from "./SidebarAccordion";
import InboxButton from "@/components/layout/ambassadors/inbox/InboxButton";

const SidebarMenuItem = ({ index, item }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const isActive = item.href === pathname;

  if (item.href === "/inbox") {
    return (
      // <Button
      //   disableRipple
      //   startContent={item.icon}
      //   onPress={() => dispatch(toggleInboxModal())}
      //   className="sidebar-menu-item h-[46px] w-full justify-start gap-4 text-base text-gray-100"
      // >
      //   {item.name}
      // </Button>

      <InboxButton item={item} />
    );
  }

  return (
    <div>
      {item.children ? (
        <SidebarAccordion index={index} item={item} isActive={isActive} />
      ) : (
        <Link
          href={item.href}
          className={`sidebar-menu-item scale-100 border border-transparent text-gray-100 transition-all active:scale-95 ${isActive ? "!bg-gray-500 text-white hover:!border-white hover:!bg-transparent" : ""}`}
        >
          <span className="mr-4">{item.icon}</span>
          {item.name}
        </Link>
      )}
    </div>
  );
};

export default SidebarMenuItem;
