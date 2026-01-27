"use client";

import {
  Star,
  Clock3,
  HistoryIcon,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { Button } from "@heroui/react";
import React, { useState, useCallback } from "react";

import WrapperContainer from "@/components/common/WrapperContainer";

const formatDate = (dateString) => {
  if (!dateString) return "Just now";

  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusDisplay = (status, rewards) => {
  const total =
    rewards?.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0) || 0;

  switch (status) {
    case "approved":
    case "highlight":
      return {
        label: `+${total} XP`,
        color: "text-green-400",
        Icon: ArrowUpCircle,
      };
    case "rejected":
      return {
        label: "Rejected",
        color: "text-red-400",
        Icon: ArrowDownCircle,
      };
    case "pending":
    default:
      return {
        label: "Pending",
        color: "text-yellow-400",
        Icon: Clock3,
      };
  }
};

const XpItem = ({ quest_name, rewards, submitted_at, review_status }) => {
  const statusDisplay = getStatusDisplay(review_status, rewards);
  const { Icon, color, label } = statusDisplay;

  return (
    <div className="group flex flex-col rounded-lg border border-gray-500/30 bg-gray-700/60 p-4 transition-all duration-300 hover:border-gray-400 hover:bg-gray-700/80">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
          {review_status === "highlight" && (
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          )}
          {quest_name || "Unknown Quest"}
        </h3>

        <div className="flex items-center gap-1.5">
          <Icon className={`h-4 w-4 ${color}`} />
          <span className={`text-sm font-bold ${color}`}>{label}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
        <HistoryIcon className="h-3.5 w-3.5 text-gray-500" />
        <span>{formatDate(submitted_at)}</span>
      </div>
    </div>
  );
};

const XpsList = ({ initialXps, initialLastKey, initialHasMore }) => {
  const [xps, setXps] = useState(initialXps);

  const [lastKey, setLastKey] = useState(initialLastKey);
  const [hasMore, setHasMore] = useState(initialHasMore);

  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !lastKey) return;
    setLoading(true);

    const params = new URLSearchParams({
      limit: "10",
      xps: "true",
      last_key: lastKey,
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
        },
      );

      if (!response.ok) throw new Error("Failed to load more XP");

      const data = await response.json();
      const newItems = data.data?.submissions || [];

      setXps((prev) => [...prev, ...newItems]);
      setLastKey(data.data?.next_key || null);
      setHasMore(!!data.data?.next_key);
    } catch (err) {
      console.error("Load more error:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, lastKey]);

  return (
    <WrapperContainer scrollable>
      <div className="thin-scrollbar space-y-6 overflow-y-auto p-4 lg:p-6 3xl:p-8">
        <header>
          <h1 className="text-xl font-bold text-white">XP Activity</h1>

          <p className="text-sm text-gray-400">
            Track your XP rewards and quest progress.
          </p>
        </header>

        <section className="space-y-3">
          {xps.length > 0 ? (
            xps.map((xp) => <XpItem key={xp.submission_id} {...xp} />)
          ) : (
            <div className="rounded-lg border border-gray-500/30 bg-gray-800/50 p-8 text-center text-sm text-gray-400">
              No XP activity yet. Complete quests to earn rewards!
            </div>
          )}
        </section>

        {hasMore && (
          <div className="flex justify-center py-4">
            <Button
              onPress={loadMore}
              isDisabled={loading}
              variant="flat"
              className="bg-gray-700/50 px-8 py-2 text-white hover:bg-gray-700"
            >
              {loading ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}

        {!hasMore && xps.length > 0 && (
          <div className="py-4 text-center">
            <p className="text-xs uppercase tracking-widest text-gray-500">
              End of History
            </p>
          </div>
        )}
      </div>
    </WrapperContainer>
  );
};

export default XpsList;
