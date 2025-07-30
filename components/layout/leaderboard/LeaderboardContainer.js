"use client";

import { addToast } from "@heroui/react";
import React, { useState, useEffect, useCallback } from "react";

import AmbassadorLeaderboard from "./AmbassadorLeaderboard";

const LeaderboardContainer = ({
  userRank,
  initialData,
  initialLastKey,
  initialHasMore,
  leaderboardType,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [lastKey, setLastKey] = useState(initialLastKey);
  const [leaderboardData, setLeaderboardData] = useState(initialData);

  // Initialize state with server data
  useEffect(() => {
    setLastKey(initialLastKey);
    setHasMore(initialHasMore);
    setLeaderboardData(initialData);
  }, [initialData, initialLastKey, initialHasMore]);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore || !lastKey) return;

    try {
      setIsLoading(true);

      const query = new URLSearchParams({
        limit: "10",
        last_key: lastKey,
      });

      // Add period parameter for all_time leaderboard
      if (leaderboardType === "all_time") {
        query.append("period", "all_time");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/leaderboards?${query.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch more data: ${response.status}`);
      }

      const { data } = await response.json();
      const newAmbassadors = data.leaderboard || [];

      if (newAmbassadors.length === 0) {
        setHasMore(false);
        return;
      }

      setLeaderboardData((prev) => [...prev, ...newAmbassadors]);
      setLastKey(data.last_key || null);
      setHasMore(data.has_more || false);
    } catch (error) {
      console.error("Error loading more data:", error);
      addToast({
        color: "danger",
        title: "Failed to load more data",
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, lastKey, leaderboardType]);

  return (
    <AmbassadorLeaderboard
      hasMore={hasMore}
      isLoading={isLoading}
      data={leaderboardData}
      onLoadMore={handleLoadMore}
      leaderboardType={leaderboardType}
      currentAmbassadorId={userRank?.ambassador_id || null}
    />
  );
};

export default LeaderboardContainer;
