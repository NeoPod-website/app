import React from "react";

const SubmissionCardLoader = () => {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-400 bg-gradient-dark p-6 shadow-lg shadow-black/20">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1.5 text-xs font-medium ring-1 ring-yellow-500/30">
            <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
            <div className="h-3 w-16 animate-pulse rounded-md bg-gray-600" />
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-gray-600/40 px-3 py-1.5 text-xs font-medium ring-1 ring-gray-400">
            <div className="h-3 w-20 animate-pulse rounded-md bg-gray-600" />
          </div>
        </div>

        <div className="h-6 w-12 animate-pulse rounded bg-gray-600" />
      </div>

      <div className="mb-4 h-5 w-2/3 animate-pulse rounded-md bg-gray-600" />

      <div className="mb-4 space-y-2 rounded-xl border-l-4 border-yellow-500/60 bg-white/10 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-600" />

        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded bg-gray-600" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-600" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-200">
        <div className="flex items-center gap-2">
          <div className="h-3 w-20 animate-pulse rounded bg-gray-600" />
        </div>
        <div className="h-3 w-20 animate-pulse rounded bg-gray-600" />
      </div>
    </div>
  );
};

export default SubmissionCardLoader;
