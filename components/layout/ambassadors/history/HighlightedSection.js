"use client";

import { Button } from "@heroui/react";
import { addToast } from "@heroui/react";
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setError,
  appendHighlighted,
  initializeHighlighted,
  setHighlightedLoading,
} from "@/redux/slice/historySlice";

import HistoryItemCard from "@/components/layout/ambassadors/history/HistoryItemCard";

const HighlightedSection = ({
  initialHighlighted,
  initialLastKey,
  initialHasMore,
}) => {
  const dispatch = useDispatch();

  const {
    highlighted,
    highlightedLastKey,
    highlightedHasMore,
    highlightedLoading,
  } = useSelector((state) => state.history);

  // Initialize on mount
  useEffect(() => {
    dispatch(
      initializeHighlighted({
        highlighted: initialHighlighted,
        lastKey: initialLastKey,
        hasMore: initialHasMore,
      }),
    );
  }, [dispatch, initialHighlighted, initialLastKey, initialHasMore]);

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

  const loadMoreHighlighted = useCallback(async () => {
    if (highlightedLoading || !highlightedHasMore || !highlightedLastKey)
      return;

    try {
      dispatch(setHighlightedLoading(true));

      const params = new URLSearchParams({
        limit: "10",
        last_key: highlightedLastKey,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions/highlighted?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch more highlighted: ${response.status}`);
      }

      const data = await response.json();
      const newHighlighted = data.data?.submissions || [];

      if (newHighlighted.length === 0) {
        dispatch(
          appendHighlighted({
            highlighted: [],
            lastKey: null,
            hasMore: false,
          }),
        );

        addToast({
          color: "default",
          title: "No more highlighted",
          description: "You've reached the end",
        });
        return;
      }

      // Enrich new submissions
      const enrichedNewHighlighted = await enrichWithQuestData(newHighlighted);

      // Add to Redux state (counts will automatically update)
      dispatch(
        appendHighlighted({
          highlighted: enrichedNewHighlighted,
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
    highlightedLoading,
    highlightedHasMore,
    highlightedLastKey,
    enrichWithQuestData,
  ]);

  return (
    <div className="hide-scroll space-y-4 overflow-y-auto">
      {highlighted.map((submission) => (
        <HistoryItemCard
          key={submission.submission_id}
          submission={submission}
          maxCommentLength={100}
        />
      ))}

      {highlightedHasMore && (
        <div className="flex justify-center py-4">
          <Button
            onPress={loadMoreHighlighted}
            disabled={highlightedLoading}
            variant="ghost"
            className="px-8 py-3 text-white hover:bg-gray-700"
          >
            {highlightedLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {!highlightedHasMore && highlighted.length > 0 && (
        <div className="py-4 text-center">
          <p className="text-gray-400">You've reached the end</p>
        </div>
      )}
    </div>
  );
};

export default HighlightedSection;
