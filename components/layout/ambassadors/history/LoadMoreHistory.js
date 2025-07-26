"use client";

import { Button, addToast } from "@heroui/react";
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setError,
  appendHistory,
  initializeHistory,
  setHistoryLoading,
} from "@/redux/slice/historySlice";

import HistoryItemCard from "@/components/layout/ambassadors/history/HistoryItemCard";

const LoadMoreHistory = ({
  initialHistory,
  initialLastKey,
  initialHasMore,
}) => {
  const dispatch = useDispatch();

  const { history, historyLastKey, historyHasMore, historyLoading } =
    useSelector((state) => state.history);

  // Initialize on mount
  useEffect(() => {
    dispatch(
      initializeHistory({
        history: initialHistory,
        lastKey: initialLastKey,
        hasMore: initialHasMore,
      }),
    );
  }, [dispatch, initialHistory, initialLastKey, initialHasMore]);

  /**
   * Enrich submissions with quest data
   */
  const enrichWithQuestData = useCallback(async (submissions) => {
    if (!submissions || submissions.length === 0) {
      return [];
    }

    try {
      const questIds = [...new Set(submissions.map((sub) => sub.quest_id))];

      const questPromises = questIds.map(async (questId) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/quests/${questId}`,
            {
              method: "GET",
              credentials: "include",
            },
          );

          if (response.ok) {
            const questData = await response.json();

            return {
              quest_id: questId,
              quest_data: questData.data?.quest || null,
            };
          }

          return { quest_id: questId, quest_data: null };
        } catch (error) {
          console.error(`Error fetching quest ${questId}:`, error);
          return { quest_id: questId, quest_data: null };
        }
      });

      const questResults = await Promise.all(questPromises);
      const questMap = questResults.reduce((acc, result) => {
        if (result.quest_data) {
          acc[result.quest_id] = result.quest_data;
        }
        return acc;
      }, {});

      const enrichedSubmissions = submissions.map((submission) => {
        const questData = questMap[submission.quest_id];

        return {
          ...submission,
          quest_name: questData?.name || "Unknown Quest",
          quest_description: questData?.description || "",
          quest_tasks: questData?.tasks || [],
          quest_rewards: questData?.rewards || [],
          category_name: questData?.category_name || "Unknown Category",
          pod_name: questData?.pod_name || "Unknown Pod",
          original_quest_data: questData,
        };
      });

      return enrichedSubmissions;
    } catch (error) {
      console.error("Error enriching with quest data:", error);
      return submissions;
    }
  }, []);

  /**
   * Load more history
   */
  const loadMoreHistory = useCallback(async () => {
    if (historyLoading || !historyHasMore || !historyLastKey) return;

    try {
      dispatch(setHistoryLoading(true));

      const params = new URLSearchParams({
        limit: "10",
        last_key: historyLastKey,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions/history?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch more history: ${response.status}`);
      }

      const data = await response.json();
      const newHistory = data.data?.submissions || [];

      if (newHistory.length === 0) {
        dispatch(
          appendHistory({
            history: [],
            lastKey: null,
            hasMore: false,
          }),
        );

        addToast({
          color: "default",
          title: "No more history",
          description: "You've reached the end",
        });
        return;
      }

      // Enrich new submissions
      const enrichedNewHistory = await enrichWithQuestData(newHistory);

      // Add to Redux state (counts will automatically update)
      dispatch(
        appendHistory({
          history: enrichedNewHistory,
          lastKey: data.data?.next_key || null,
          hasMore: !!data.data?.next_key,
        }),
      );
    } catch (error) {
      dispatch(setError(error.message));
      addToast({
        color: "danger",
        title: "Error loading more",
        description: error.message || "Please try again",
      });
    }
  }, [
    dispatch,
    historyLoading,
    historyHasMore,
    historyLastKey,
    enrichWithQuestData,
  ]);

  return (
    <div className="flex flex-1 flex-col justify-between space-y-3 overflow-y-auto scrollbar-hide 3xl:space-y-4">
      {history.map((submission) => (
        <HistoryItemCard
          key={submission.submission_id}
          submission={submission}
        />
      ))}

      <div>
        {historyHasMore && (
          <div className="flex justify-center py-4">
            <Button
              onPress={loadMoreHistory}
              disabled={historyLoading}
              variant="ghost"
              className="px-8 py-3 text-white hover:bg-gray-700"
            >
              {historyLoading ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}

        {!historyHasMore && history.length > 0 && (
          <div className="py-4 text-center">
            <p className="text-sm text-gray-300 3xl:text-base">
              You've reached the end
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadMoreHistory;
