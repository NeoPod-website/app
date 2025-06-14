"use client";

import { Button } from "@heroui/react";
import { PlusIcon, RefreshCwIcon } from "lucide-react";

const SubmissionsLoadMoreBtn = ({ onLoadMore, isLoading, hasMore }) => {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center p-6">
      <Button
        size="md"
        radius="full"
        onPress={onLoadMore}
        disabled={isLoading}
        className="border border-gray-300 bg-gray-700 font-medium text-white transition-colors hover:bg-gray-600"
        startContent={
          isLoading ? (
            <RefreshCwIcon className="h-4 w-4 animate-spin" />
          ) : (
            <PlusIcon className="h-4 w-4" />
          )
        }
      >
        {isLoading ? "Loading..." : "Load More Submissions"}
      </Button>
    </div>
  );
};

export default SubmissionsLoadMoreBtn;
