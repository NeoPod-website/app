"use client";

import { memo } from "react";
import { Button } from "@heroui/react";
import { ChevronDownIcon } from "lucide-react";

const LoadMoreAdminSubmissions = memo(({ onLoadMore, loading, hasMore }) => {
  if (!hasMore) {
    return (
      <div className="flex justify-center p-4">
        <div className="text-sm text-gray-300">No more submissions to load</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4">
      <Button
        size="md"
        variant="bordered"
        isLoading={loading}
        onPress={onLoadMore}
        startContent={!loading && <ChevronDownIcon className="h-4 w-4" />}
      >
        {loading ? "Loading..." : "Load More"}
      </Button>
    </div>
  );
});

LoadMoreAdminSubmissions.displayName = "LoadMoreAdminSubmissions";

export default LoadMoreAdminSubmissions;
