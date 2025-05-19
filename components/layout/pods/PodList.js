"use client";

import { useEffect, useState } from "react";

import LoadMorePods from "@/components/ui/buttons/pods/LoadMoreButton";

import PodListLoader from "@/components/ui/loader/pods/PodListLoader";
import FilterPanelLoader from "@/components/ui/loader/filter/FilterPanelLoader";
import FilterHeaderLoader from "@/components/ui/loader/filter/FilterHeaderLoader";

export default function PodsList({ initialPods, lastEvaluatedKey, hasMore }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-1 flex-col space-y-3 overflow-hidden">
      {isClient ? (
        <LoadMorePods
          initialPods={initialPods}
          initialLastKey={lastEvaluatedKey}
          initialHasMore={hasMore}
        />
      ) : (
        <>
          <FilterHeaderLoader />
          <FilterPanelLoader />
          <PodListLoader />
        </>
      )}
    </div>
  );
}
