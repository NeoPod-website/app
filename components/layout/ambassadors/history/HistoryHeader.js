import React from "react";
import { Button } from "@heroui/react";
import { RefreshCwIcon, HistoryIcon } from "lucide-react";

const HistoryHeader = ({ count, hasMore, onRefresh, isLoading }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-700 bg-gray-900/50 p-4">
      <div className="flex items-center space-x-3">
        <div className="bg-blue-500/20 rounded-lg p-2">
          <HistoryIcon size={24} className="text-blue-400" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-white">Submission History</h1>
          <p className="text-sm text-gray-400">
            {count} completed submission{count !== 1 ? "s" : ""}
            {hasMore && " (showing latest)"}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          onPress={onRefresh}
          disabled={isLoading}
          className="text-gray-300 hover:text-white"
          startContent={
            <RefreshCwIcon
              size={16}
              className={isLoading ? "animate-spin" : ""}
            />
          }
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
    </div>
  );
};

export default HistoryHeader;
