import React from "react";

const PodCardLoader = () => {
  return (
    <div className="w-full rounded-2.5xl border border-gray-700 bg-black/50">
      <div className="h-24 w-full animate-pulse rounded-t-2.5xl bg-gray-600"></div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between">
          <div className="h-6 w-32 animate-pulse rounded bg-gray-600"></div>

          <div className="flex items-center gap-2">
            <div className="h-5 w-16 animate-pulse rounded-full bg-gray-600"></div>
            <div className="h-5 w-8 animate-pulse rounded-full bg-gray-600"></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-600"></div>
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-600"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-600"></div>
          <div className="h-4 w-24 animate-pulse rounded bg-gray-600"></div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <div className="h-8 w-20 animate-pulse rounded-full bg-gray-600"></div>
          <div className="h-8 w-20 animate-pulse rounded-full bg-gray-600"></div>
        </div>
      </div>
    </div>
  );
};

export default PodCardLoader;
