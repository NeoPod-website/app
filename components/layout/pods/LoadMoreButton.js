"use client";

import PodCard from "./PodCard";

import { Loader2Icon } from "lucide-react";
import { useState, useEffect } from "react";

export default function LoadMoreButton({ initialLastKey }) {
  const [newPods, setNewPods] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentKey, setCurrentKey] = useState(null);

  useEffect(() => {
    setCurrentKey(initialLastKey);
  }, [initialLastKey]);

  const handleLoadMore = async () => {
    if (isLoading || !currentKey) return;

    try {
      setIsLoading(true);

      const encodedKey = encodeURIComponent(JSON.stringify(currentKey));
      const url = `${process.env.NEXT_PUBLIC_API_URL}/pods?limit=6&startKey=${encodedKey}`;

      const response = await fetch(url, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        if (data.data.pods.length > 0) {
          setNewPods((prevPods) => [...prevPods, ...data.data.pods]);

          setCurrentKey(data.data.pagination.lastEvaluatedKey);

          if (!data.data.pagination.hasMore) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } else {
        throw new Error(data.message || "Failed to load more pods");
      }
    } catch (error) {
      console.error("Error loading more pods:", error);
      alert("Failed to load more pods. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {}, []);

  if (!hasMore && newPods.length === 0) return null;

  return (
    <>
      {newPods.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {newPods.map((pod) => (
            <PodCard key={pod.pod_id} pod={pod} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-full border border-gray-400 bg-black/50 px-6 py-2.5 text-white transition-colors hover:border-gray-600 hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2Icon className="animate-spin h-4 w-4" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}
    </>
  );
}
