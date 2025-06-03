import React from "react";

import WrapperContainer from "@/components/common/WrapperContainer";

const QuestDetailLoader = () => {
  return (
    <WrapperContainer scrollable className="max-w-4.5xl flex-[2] p-10">
      <div className="hide-scroll flex-1 space-y-9 overflow-y-auto">
        <div className="space-y-2.5">
          <div className="h-10 w-3/4 animate-pulse rounded-lg bg-gray-600" />

          <div className="flex gap-2">
            <div className="flex w-fit items-center gap-1 rounded-full border-t border-gray-400 bg-gradient-dark px-2.5 py-1">
              <div className="h-3 w-3 animate-pulse rounded-sm bg-gray-600" />
              <div className="h-3 w-20 animate-pulse rounded bg-gray-600" />
            </div>

            <div className="flex w-fit items-center gap-1 rounded-full border-t border-gray-400 bg-gradient-dark px-2.5 py-1">
              <div className="h-3 w-3 animate-pulse rounded-sm bg-gray-600" />
              <div className="h-3 w-16 animate-pulse rounded bg-gray-600" />
            </div>

            <div className="flex w-fit items-center gap-1 rounded-full border-t border-gray-400 bg-gradient-dark px-2.5 py-1">
              <div className="h-3 w-3 animate-pulse rounded-sm bg-gray-600" />
              <div className="h-3 w-24 animate-pulse rounded bg-gray-600" />
            </div>

            <div className="flex w-fit items-center gap-1 rounded-full border-t border-gray-400 bg-gradient-dark px-2.5 py-1">
              <div className="h-3 w-3 animate-pulse rounded-sm bg-gray-600" />
              <div className="w-18 h-3 animate-pulse rounded bg-gray-600" />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <h3 className="text-2xl font-bold">Rewards</h3>

          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 w-20 bg-[url('/dashboard/quest/points-background.png')] bg-cover bg-center px-2 py-2"
              >
                <div className="flex h-full w-full flex-col items-center justify-center rounded-md border border-gray-400 bg-black/70 text-center text-white">
                  <div className="mb-1 h-6 w-8 animate-pulse rounded bg-gray-600" />

                  <div className="h-3 w-12 animate-pulse rounded bg-gray-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <h3 className="text-2xl font-bold">Description</h3>

          <div className="prose prose-invert max-w-none space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-gray-600" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-600" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-gray-600" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-600" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-600" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-600" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-600" />
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-between">
        <div className="h-11 w-28 animate-pulse rounded-full bg-gray-600" />

        <div className="flex gap-4">
          <div className="h-11 w-32 animate-pulse rounded-full bg-gray-600" />
          <div className="h-11 w-32 animate-pulse rounded-full bg-gray-600" />
        </div>
      </div>
    </WrapperContainer>
  );
};

export default QuestDetailLoader;
