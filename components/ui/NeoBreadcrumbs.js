"use client";

import React from "react";
import Link from "next/link";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";

const NeoBreadcrumbs = ({ list }) => {
  return (
    <Breadcrumbs underline="active">
      {list.map((item, index) => {
        const isLast = index === list.length - 1;

        return (
          <BreadcrumbItem
            key={item.title}
            className="truncate text-sm 3xl:text-base"
          >
            {isLast || !item.href ? (
              item.title
            ) : (
              <Link href={item.href} className="text-xs 3xl:text-sm">
                {item.title}
              </Link>
            )}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumbs>
  );
};

export default NeoBreadcrumbs;
