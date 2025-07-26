"use client";

import React from "react";
import Link from "next/link";
import { Accordion, AccordionItem } from "@heroui/react";

const SidebarAccordion = ({ index, item, isActive }) => {
  return (
    <Accordion selectionMode="single" className="p-0">
      <AccordionItem
        title={item.name}
        aria-label={item.name}
        startContent={item.icon}
        key={`accordion-${index}`}
        classNames={{
          trigger:
            "py-2.5 gap-3 md:gap-1 xl:gap-3 2xl:gap-4 bg-transparent hover:bg-gray-500 px-3 rounded-md transition-colors hover:bg-gray-500 text-gray-100 hover:text-white justify-center xl:justify-between",
          indicator: `text-gray-100 hover:text-white ${isActive ? "!bg-gray-500 text-white hover:!border-white hover:!bg-transparent" : ""}`,
          title: `text-gray-100 hover:text-white md:hidden xl:inline text-sm 3xl:text-base ${isActive ? "!bg-gray-500 text-white hover:!border-white hover:!bg-transparent" : ""}`,
        }}
      >
        {item.children.map((child, childIndex) => (
          <Link
            href={child.href}
            title={child.name}
            key={`child-${index}-${childIndex}`}
            className="sidebar-menu-item ml-6 scale-100 text-sm text-gray-200 transition-all active:scale-95 md:ml-0 xl:ml-6 2xl:ml-8 3xl:text-base"
          >
            <span className="mr-3 md:mr-0 xl:mr-3 2xl:mr-4">{child.icon}</span>
            <span className="md:hidden xl:inline">{child.name}</span>
          </Link>
        ))}
      </AccordionItem>
    </Accordion>
  );
};

export default SidebarAccordion;
