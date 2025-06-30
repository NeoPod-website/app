import React from "react";

const SubmissionsHeaderLoader = () => {
  return (
    <div className="space-y-6 p-8 pb-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-60 animate-pulse rounded bg-gray-600" />
          <div className="h-4 w-48 animate-pulse rounded bg-gray-600" />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 rounded-2xl bg-yellow-500/10 px-4 py-3 ring-1 ring-yellow-500/20">
            <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
            <div className="h-4 w-24 animate-pulse rounded-md bg-gray-600" />
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-gray-400 bg-gradient-dark/60 px-4 py-3">
            <div className="h-4 w-4 animate-pulse rounded-full bg-gray-600" />
            <div className="h-4 w-16 animate-pulse rounded-md bg-gray-600" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-600 bg-black/5 p-4">
        <div className="flex items-start gap-3">
          <div className="h-5 w-5 animate-pulse rounded-full bg-gray-600" />

          <div className="w-full space-y-2">
            <div className="h-4 w-40 animate-pulse rounded bg-gray-600" />
            <div className="h-3 w-full animate-pulse rounded bg-gray-600" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsHeaderLoader;
