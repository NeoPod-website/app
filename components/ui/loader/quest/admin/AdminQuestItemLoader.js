import React from "react";

const AdminQuestItemLoader = () => {
  return (
    <div className="mb-4 select-none">
      <div className="flex w-full items-center justify-between gap-5 rounded-lg border border-gray-400 bg-gradient-dark px-5 py-4">
        <div className="flex flex-1 items-center gap-5">
          <div className="h-5 w-5 animate-pulse rounded bg-gray-600"></div>

          <div className="flex flex-1 items-center gap-2 overflow-hidden">
            <div className="min-w-0 rounded-lg border border-gray-400 bg-gray-700 px-4 py-2.5">
              <div className="h-5 w-32 animate-pulse rounded bg-gray-600"></div>
            </div>

            <div className="flex items-center gap-1">
              <div className="h-6 w-6 animate-pulse rounded bg-gray-600"></div>
              <div className="h-6 w-6 animate-pulse rounded bg-gray-600"></div>
              <div className="h-6 w-6 animate-pulse rounded bg-gray-600"></div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="h-11 w-28 animate-pulse rounded-full border border-gray-400 bg-gray-700"></div>
          <div className="h-11 w-28 animate-pulse rounded-full border border-gray-400 bg-gray-700"></div>
          <div className="h-11 w-32 animate-pulse rounded-full border border-gray-400 bg-gray-700"></div>
          <div className="h-5 w-5 animate-pulse rounded bg-gray-600"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminQuestItemLoader;
