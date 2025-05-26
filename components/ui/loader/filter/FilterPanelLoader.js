"use client";

import React from "react";

const FilterPanelLoader = () => {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between px-8">
        <div className="flex space-x-2 rounded-full border-2 border-gray-500 p-1">
          <div className="h-8 w-24 rounded-full bg-gray-600"></div>
          <div className="h-8 w-24 rounded-full bg-gray-600"></div>
          <div className="h-8 w-24 rounded-full bg-gray-600"></div>
          <div className="h-8 w-24 rounded-full bg-gray-600"></div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="h-10 w-80 rounded-full bg-gray-600"></div>

          <div className="h-9 w-28 rounded-full bg-gray-600"></div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanelLoader;
