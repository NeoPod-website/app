import React from "react";

const AdminDetailDescriptionContainerLoader = () => {
  return (
    <>
      <div className="hide-scroll relative flex-1 overflow-auto">
        <div className="mb-6 h-10 w-64 animate-pulse rounded bg-gray-600"></div>

        <div className="mb-8 space-y-4">
          <div className="h-32 w-full animate-pulse rounded border border-gray-400 bg-gray-700"></div>

          <div className="flex gap-2">
            <div className="h-8 w-8 animate-pulse rounded bg-gray-600"></div>
            <div className="h-8 w-8 animate-pulse rounded bg-gray-600"></div>
            <div className="h-8 w-8 animate-pulse rounded bg-gray-600"></div>
            <div className="h-8 w-8 animate-pulse rounded bg-gray-600"></div>
            <div className="h-8 w-8 animate-pulse rounded bg-gray-600"></div>
          </div>
        </div>

        <h2 className="mb-4 text-2xl font-bold">Tasks</h2>
        <div className="relative space-y-3">
          <div className="h-20 w-full animate-pulse rounded border border-gray-400 bg-gray-700"></div>
          <div className="h-20 w-full animate-pulse rounded border border-gray-400 bg-gray-700"></div>
          <div className="h-20 w-full animate-pulse rounded border border-gray-400 bg-gray-700"></div>
        </div>
      </div>

      <div className="sticky bottom-0 left-0 h-16 w-full rounded-xl border border-gray-400 bg-gradient-dark">
        <div className="flex h-full items-center justify-start px-3 py-2">
          <div className="flex items-center justify-center rounded-full bg-gradient-primary p-2.5">
            <div className="h-4 w-4 animate-pulse rounded bg-gray-600"></div>
          </div>

          <div className="ml-3 text-start">
            <div className="mb-1 h-4 w-20 animate-pulse rounded bg-gray-600"></div>
            <div className="h-3 w-32 animate-pulse rounded bg-gray-600"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDetailDescriptionContainerLoader;
