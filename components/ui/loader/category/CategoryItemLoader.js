"use client";

import React from "react";
import { Skeleton } from "@heroui/react";

const CategoryItemLoader = () => {
  return (
    <div className="relative h-40 min-h-40 w-full overflow-hidden rounded-2.5xl p-5">
      <div
        className="absolute inset-0 z-10 bg-cover bg-center opacity-70"
        style={{
          backgroundImage: `url('/dashboard/category/background-2.jpg')`,
        }}
      ></div>

      <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2.5 font-work-sans">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-md" />
      </div>

      <div className="absolute bottom-5 right-5 z-20">
        <Skeleton className="h-5 w-20 rounded-md" />
      </div>
    </div>
  );
};

export default CategoryItemLoader;
