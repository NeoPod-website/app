"use client";

import React from "react";

const LeaderboardSkeleton = () => {
  return (
    <div className="w-full pr-3">
      <div className="mb-4 flex items-center justify-between rounded-2xl bg-gray-700/30 p-3 md:p-4">
        <div className="flex gap-2">
          <div className="h-4 w-12 animate-pulse rounded bg-gray-600 md:w-16"></div>
          <div className="h-4 w-40 animate-pulse rounded bg-gray-600 sm:w-60 md:w-80"></div>
          <div className="h-4 w-20 animate-pulse rounded bg-gray-600 md:w-24"></div>
        </div>

        <div className="flex gap-8">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-600 md:w-20"></div>
          <div className="h-4 w-20 animate-pulse rounded bg-gray-600"></div>
          <div className="h-4 w-8 animate-pulse rounded bg-gray-600 md:w-12"></div>
        </div>
      </div>

      <div className="space-y-2">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-2xl bg-gray-700/20 p-3 md:p-4"
          >
            <div className="flex gap-2">
              <div className="flex w-12 flex-shrink-0 items-center justify-start md:w-16">
                <div className="h-6 w-6 animate-pulse rounded-full bg-gray-600"></div>
              </div>

              <div className="flex w-40 min-w-0 flex-shrink-0 items-center gap-2 sm:w-60 md:w-80 md:gap-4">
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-600 md:h-12 md:w-12"></div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 h-4 w-24 animate-pulse rounded bg-gray-600"></div>
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-600"></div>
                </div>
              </div>

              <div className="flex w-20 flex-shrink-0 items-center justify-center md:w-24">
                <div className="h-6 w-16 animate-pulse rounded-full bg-gray-600"></div>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="flex w-16 flex-shrink-0 flex-col items-end md:w-20">
                <div className="mb-1 h-4 w-12 animate-pulse rounded bg-gray-600"></div>
                <div className="h-3 w-8 animate-pulse rounded bg-gray-600"></div>
              </div>

              <div className="flex w-20 flex-shrink-0 justify-center">
                <div className="h-4 w-8 animate-pulse rounded bg-gray-600"></div>
              </div>

              <div className="flex w-8 flex-shrink-0 justify-center md:w-12">
                <div className="h-6 w-6 animate-pulse rounded-full bg-gray-600"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardSkeleton;
