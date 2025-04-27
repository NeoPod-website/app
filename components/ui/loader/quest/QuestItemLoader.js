"use client";

import React from "react";
import { Skeleton } from "@heroui/react";

const QuestItemLoader = () => {
  return (
    <li>
      <div className="flex items-center justify-between gap-12 rounded-2.5xl border-t border-gray-400 bg-gradient-dark/60 px-5 py-4">
        <div className="flex-1 space-y-3">
          <div className="flex w-fit items-center gap-0.5 rounded-full bg-gray-600 px-1.5 py-0.5">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-10 rounded-full" />
          </div>

          <div>
            <Skeleton className="h-5 w-40 rounded-md" />
            <Skeleton className="mt-1 h-3 w-24 rounded-md" />
          </div>

          <div className="flex gap-3">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-6 w-6 rounded-full" />
              ))}
              {/* No count skeleton needed as we are explicitly showing max 3 */}
            </div>
            <div className="flex w-fit items-center gap-0.5 rounded bg-green-400/50 px-1 py-0.5">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-3 w-8 rounded-full" />
            </div>
          </div>
        </div>

        <div className="h-20 w-20 bg-[url('/dashboard/quest/points-background.png')] bg-cover bg-center px-2 py-2">
          <div className="flex h-full w-full flex-col items-center justify-center rounded-md border border-gray-400 bg-black/70 text-center text-white">
            <Skeleton className="h-6 w-10 rounded-md" />
            <Skeleton className="mt-1 h-3 w-12 rounded-md" />
          </div>
        </div>
      </div>
    </li>
  );
};

export default QuestItemLoader;
