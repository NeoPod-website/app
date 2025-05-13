"use client";

import { useEffect, useState } from "react";

import PodCard from "./PodCard";
import LoadMoreButton from "./LoadMoreButton";

export default function PodsList({ initialPods, lastEvaluatedKey, hasMore }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      <div
        id="pods-container"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {initialPods.map((pod) => (
          <PodCard key={pod.pod_id} pod={pod} />
        ))}
      </div>

      {isClient && hasMore && lastEvaluatedKey && (
        <LoadMoreButton initialLastKey={lastEvaluatedKey} />
      )}
    </div>
  );
}
