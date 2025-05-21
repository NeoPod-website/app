import React from "react";

const CategoryItemLoader = () => {
  return (
    <div className="relative h-40 min-h-40 w-full overflow-hidden rounded-2.5xl border border-gray-700 bg-black/50">
      <div className="absolute inset-0 z-10 animate-pulse bg-gray-600 opacity-70"></div>

      <div className="absolute bottom-5 left-5 z-20 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-600"></div>

          <div className="h-7 w-40 animate-pulse rounded bg-gray-600"></div>
        </div>

        <div className="h-4 w-64 animate-pulse rounded bg-gray-600"></div>
      </div>

      <div className="absolute bottom-5 right-5 z-20 h-4 w-16 animate-pulse rounded-full bg-gray-600"></div>
    </div>
  );
};

export default CategoryItemLoader;
