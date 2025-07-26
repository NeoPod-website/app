import React from "react";

import HistoryItemCardLoader from "@/components/ui/loader/history/HistoryItemCardLoader";
import WrapperContainer from "@/components/common/WrapperContainer";

const HighlightLoader = () => {
  return (
    <WrapperContainer
      scrollable
      className="max-w-md flex-1 space-y-6 p-6 px-4 3xl:p-10"
    >
      <h2 className="font-work-sans text-3xl font-bold 3xl:text-4xl">
        Highlighted
      </h2>

      <div className="hide-scroll space-y-4 overflow-y-auto">
        {[...Array(8)].map((_, index) => (
          <HistoryItemCardLoader key={index} />
        ))}

        <div className="flex justify-center py-4">
          <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-600" />
        </div>
      </div>
    </WrapperContainer>
  );
};

export default HighlightLoader;
