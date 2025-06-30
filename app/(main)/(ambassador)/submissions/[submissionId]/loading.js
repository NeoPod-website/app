"use client";

import React from "react";

import WrapperContainer from "@/components/common/WrapperContainer";

const SubmissionDetailLoading = () => {
  return (
    <div className="flex flex-1 gap-4 overflow-hidden">
      <div className="flex max-w-7xl flex-1 flex-col gap-2 overflow-hidden">
        <div className="space-y-6 pb-6">
          <div className="flex justify-between gap-2.5 rounded-xl border-t border-gray-400 bg-black/50 px-8 py-2.5 backdrop-blur-xs">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="h-3 w-3 animate-pulse rounded-full bg-gray-600" />
              <span>Back to Submissions</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-yellow-500/20 px-3 py-1.5 text-xs font-medium text-yellow-300 ring-1 ring-yellow-500/30">
                <div className="h-3 w-3 animate-pulse rounded-full bg-gray-600" />
                <span>Pending Review</span>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-gray-600 px-3 py-1.5 text-xs font-medium text-gray-200 ring-1 ring-gray-400">
                <div className="h-3 w-3 animate-pulse rounded-full bg-gray-600" />
                <span>--</span>
              </div>

              <div className="h-8 w-20 animate-pulse rounded border border-gray-400 bg-gray-700" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-gray-600" />
            <div className="h-6 w-32 animate-pulse rounded bg-gray-700" />
          </div>
        </div>

        <WrapperContainer
          scrollable
          className="space-y-6 overflow-y-auto p-10 scrollbar-hide"
        >
          <div className="w-40 animate-pulse rounded bg-gray-700 py-4" />

          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="space-y-4 rounded-2xl border border-gray-400 bg-gradient-dark p-6"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-700" />
                <div className="space-y-2">
                  <div className="h-4 w-64 animate-pulse rounded bg-gray-600" />
                  <div className="h-3 w-32 animate-pulse rounded bg-gray-700" />
                </div>
              </div>

              <div className="h-4 w-full animate-pulse rounded bg-gray-700" />
              <div className="h-20 w-full animate-pulse rounded-xl bg-gray-700" />
            </div>
          ))}
        </WrapperContainer>
      </div>

      <div className="hidden max-w-md flex-1 flex-col gap-2 md:flex">
        <div className="flex justify-between gap-2.5 rounded-xl border-t border-gray-400 bg-black/50 px-8 py-2.5 backdrop-blur-xs">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-600" />
          <div className="h-8 w-28 animate-pulse rounded bg-gray-700" />
        </div>

        <div className="space-y-3 overflow-y-auto scrollbar-hide">
          <div className="h-24 animate-pulse rounded-2xl border border-gray-400 bg-gradient-dark" />
          <div className="h-40 animate-pulse rounded-2xl border border-gray-400 bg-gradient-dark" />
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailLoading;
