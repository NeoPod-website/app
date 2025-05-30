import React from "react";

const TwoContainerLoader = () => {
  return (
    <div className="flex h-full flex-1 gap-4 overflow-hidden pb-6">
      <div className="h-full flex-1 animate-pulse rounded-2.5xl bg-gray-600"></div>
      <div className="h-full flex-1 animate-pulse rounded-2.5xl bg-gray-600"></div>
    </div>
  );
};

export default TwoContainerLoader;
