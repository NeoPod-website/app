"use client";

import React from "react";

// A simplified loader for just the filter header
const FilterHeaderLoader = () => {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between gap-4 rounded-xl border-t border-gray-400 bg-black/60 px-8 py-2.5 backdrop-blur-sm">
        <div className="h-6 w-32 rounded-md bg-gray-600"></div>

        <div className="flex items-center gap-4">
          <div className="h-10 w-80 rounded-full bg-gray-600"></div>
          <div className="h-8 w-8 rounded-full bg-gray-600"></div>
          <div className="h-9 w-32 rounded-full bg-white"></div>
        </div>
      </div>
    </div>
  );
};

export default FilterHeaderLoader;
