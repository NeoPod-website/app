import React from "react";

const HistoryItemCardLoader = () => {
  return (
    <div className="group relative rounded-2xl border border-gray-600/30 bg-gradient-dark p-6 shadow-lg shadow-black/20">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 animate-pulse rounded bg-gray-600/50"></div>
            <div className="h-3 w-20 animate-pulse rounded bg-gray-600/50"></div>
          </div>

          <div className="h-5 w-3/4 animate-pulse rounded bg-gray-600/50"></div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5">
          <div className="h-3 w-3 animate-pulse rounded-full bg-gray-600/50"></div>
          <div className="h-3 w-16 animate-pulse rounded bg-gray-600/50"></div>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-gray-600/30 bg-gray-800/20 p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-3.5 w-3.5 animate-pulse rounded bg-gray-600/50"></div>
          <div className="h-3 w-24 animate-pulse rounded bg-gray-600/50"></div>
        </div>

        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-600/50"></div>
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-600/50"></div>
          <div className="h-4 w-4/6 animate-pulse rounded bg-gray-600/50"></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 animate-pulse rounded-full bg-gray-600/50"></div>
            <div className="h-3 w-20 animate-pulse rounded bg-gray-600/50"></div>
          </div>

          <div className="h-3 w-16 animate-pulse rounded bg-gray-600/50"></div>
        </div>

        <div className="flex animate-pulse items-center gap-2 rounded-lg bg-gray-600/50 px-4 py-2">
          <div className="h-3 w-20 rounded bg-gray-500/50"></div>
          <div className="h-3.5 w-3.5 rounded bg-gray-500/50"></div>
        </div>
      </div>
    </div>
  );
};

export default HistoryItemCardLoader;
