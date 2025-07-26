import React from "react";

import HistoryItemCardLoader from "@/components/ui/loader/history/HistoryItemCardLoader";

const HistoryLoader = () => {
  return (
    <div className="flex flex-1 flex-col space-y-3 overflow-y-auto scrollbar-hide 3xl:space-y-4">
      {[...Array(8)].map((_, index) => (
        <HistoryItemCardLoader key={index} />
      ))}

      <div className="flex justify-center py-4">
        <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-600" />
      </div>
    </div>
  );
};

export default HistoryLoader;
