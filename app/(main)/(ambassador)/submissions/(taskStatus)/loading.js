import React from "react";

const SubmissionCardSkeleton = () => (
  <div className="rounded-2xl border border-gray-700 bg-gray-700/50 p-6">
    <div className="mb-4 flex items-start justify-between">
      <div className="space-y-2">
        <div className="h-4 w-20 animate-pulse rounded bg-gray-700" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-gray-700" />
      </div>

      <div className="h-6 w-16 animate-pulse rounded-full bg-gray-700" />
    </div>

    <div className="mb-4 rounded-xl border-l-4 border-gray-600 bg-gray-700/40 p-4">
      <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-700" />

      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-gray-700" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-700" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-700" />
      </div>
    </div>

    <div className="flex items-center justify-between">
      <div className="h-4 w-32 animate-pulse rounded bg-gray-700" />
      <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-700" />
    </div>
  </div>
);

const RejectedSubmissionsLoader = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <div className="space-y-6 p-8 pb-4">
        <div className="flex items-center gap-4">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-700" />
          <div className="h-6 w-px bg-gray-400" />

          <div className="flex items-center gap-2">
            <div className="h-5 w-5 animate-pulse rounded bg-gray-700" />
            <div className="h-6 w-40 animate-pulse rounded bg-gray-700" />
          </div>
        </div>

        <div className="h-5 w-96 animate-pulse rounded bg-gray-700" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-400 bg-gradient-dark p-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-700" />
                <div className="space-y-1">
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-700" />
                  <div className="h-5 w-12 animate-pulse rounded bg-gray-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-8">
        <div className="mb-6 h-32 w-full animate-pulse rounded-2xl bg-gray-700/30" />

        <div className="mb-6 flex items-center justify-between">
          <div className="h-6 w-48 animate-pulse rounded bg-gray-700" />
          <div className="h-4 w-32 animate-pulse rounded bg-gray-700" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SubmissionCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RejectedSubmissionsLoader;
