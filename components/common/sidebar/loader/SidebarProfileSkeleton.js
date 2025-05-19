import React from "react";

const SidebarProfileSkeleton = () => {
  return (
    <div className="flex items-center justify-start gap-3 overflow-hidden px-3 py-2">
      <div className="relative h-12 min-w-12">
        <div className="h-12 w-12 animate-pulse rounded-md bg-gray-600"></div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-1">
          <div className="h-5 w-28 animate-pulse rounded bg-gray-600"></div>
          <div className="ml-1 h-4 w-16 animate-pulse rounded bg-gray-600"></div>
        </div>

        <div className="mt-1 flex justify-between">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-600"></div>
        </div>
      </div>
    </div>
  );
};

export default SidebarProfileSkeleton;
