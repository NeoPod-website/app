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
            "py-2.5 gap-4 bg-transparent hover:bg-gray-500 px-3 rounded-md transition-colors hover:bg-gray-500 text-gray-100 hover:text-white",
          indicator: `text-gray-100 hover:text-white ${isActive ? "!bg-gray-500 text-white hover:!border-white hover:!bg-transparent" : ""}`,
          title: `text-gray-100 hover:text-white ${isActive ? "!bg-gray-500 text-white hover:!border-white hover:!bg-transparent" : ""}`,
        }}
      >
        {item.children.map((child, childIndex) => (
          <Link
            href={child.href}
            key={`child-${index}-${childIndex}`}
            className="sidebar-menu-item ml-8 text-gray-200"
          >
            <span className="mr-4">{child.icon}</span>

            {child.name}
          </Link>
        ))}
      </AccordionItem>
    </Accordion>
  );
};

export default SidebarAccordion;
