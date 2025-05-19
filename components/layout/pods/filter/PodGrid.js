"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Loader2Icon } from "lucide-react";

import PodCard from "@/components/layout/pods/PodCard";

export default function PodGrid({
  pods,
  hasMore,
  isLoading,
  loadMorePods,
  resetFilters,
  hasActiveFilters,
}) {
  if (pods.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-lg border border-gray-700 bg-black/30 p-6 text-center">
        {isLoading ? (
          <Loader2Icon className="h-8 w-8 animate-spin text-blue-500" />
        ) : hasActiveFilters ? (
          <>
            <p className="text-lg text-gray-300">No PODs match your filters</p>

            <Button
              size="md"
              onPress={resetFilters}
              className="rounded-full border border-gray-400 bg-black/50 px-4 py-2 text-white transition-colors hover:border-gray-600 hover:bg-black/70"
            >
              Clear Filters
            </Button>
          </>
        ) : (
          <>
            <p className="text-lg text-gray-300">No PODs found</p>

            <Link
              href="/admin/manage/pods/create"
              className="rounded-full border border-gray-400 bg-black/50 px-4 py-2 text-white transition-colors hover:border-gray-600 hover:bg-black/70"
            >
              Create Your First POD
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <div
        id="pods-container"
        className="mt-3 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {pods.map((pod) => (
          <PodCard key={pod.pod_id} pod={pod} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        {hasMore ? (
          <Button
            size="md"
            disabled={isLoading}
            onPress={loadMorePods}
            className="flex items-center gap-2 rounded-full border border-gray-400 bg-black/50 px-4 py-2 text-white transition-colors hover:border-gray-600 hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        ) : (
          <p className="text-gray-400">You've reached the end of the list</p>
        )}
      </div>
    </>
  );
}
