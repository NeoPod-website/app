import React from "react";
import { Button } from "@heroui/react";
import { RefreshCw } from "lucide-react";

import HistoryItemCard from "./HistoryItemCard";

const HistoryGrid = ({
  history,
  hasMore,
  isLoading,
  onRefresh,
  loadMoreHistory,
}) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center space-y-4 p-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white">
            No submission history found
          </h3>

          <p className="mt-2 text-gray-400">
            You haven't completed any quests yet. Start participating in quests
            to see your submission history here.
          </p>
        </div>

        <Button
          onPress={onRefresh}
          variant="ghost"
          disabled={isLoading}
          startContent={
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          }
          className="text-gray-300 hover:text-white"
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col space-y-4 overflow-y-auto p-4 scrollbar-hide">
      {history.map((submission) => (
        <HistoryItemCard
          key={submission.submission_id}
          submission={submission}
        />
      ))}

      {hasMore && (
        <div className="flex justify-center py-6">
          <Button
            onPress={loadMoreHistory}
            disabled={isLoading}
            variant="ghost"
            className="px-8 py-3 text-white hover:bg-gray-700"
          >
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {!hasMore && history.length > 0 && (
        <div className="py-6 text-center">
          <p className="text-gray-400">
            You've reached the end of your submission history
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryGrid;
