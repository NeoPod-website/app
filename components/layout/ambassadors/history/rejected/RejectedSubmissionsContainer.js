"use client";

import { addToast } from "@heroui/react";
import React, { useState, useCallback } from "react";

import RejectedSubmissionsList from "./RejectedSubmissionsList";
import RejectedSubmissionsHeader from "./RejectedSubmissionsHeader";

const RejectedSubmissionsContainer = ({
  initialStats,
  initialLastKey,
  initialHasMore,
  initialSubmissions,
}) => {
  const [stats, setStats] = useState(initialStats);
  const [isLoading, setIsLoading] = useState(false);
  const [lastKey, setLastKey] = useState(initialLastKey);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [submissions, setSubmissions] = useState(initialSubmissions);

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

  const loadMoreSubmissions = useCallback(async () => {
    if (isLoading || !hasMore || !lastKey) return;

    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        status: "rejected",
        limit: "10",
        last_key: lastKey,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions/rejected?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch more rejected submissions: ${response.status}`,
        );
      }

      const data = await response.json();
      const newSubmissions = data.data?.submissions || [];

      if (newSubmissions.length === 0) {
        setHasMore(false);
        setLastKey(null);
        addToast({
          color: "default",
          title: "No more submissions",
          description: "You've reached the end of your rejected submissions",
        });
        return;
      }

      // Enrich new submissions with quest data
      const enrichedNewSubmissions = await enrichWithQuestData(newSubmissions);

      // Update state
      const updatedSubmissions = [...submissions, ...enrichedNewSubmissions];
      setSubmissions(updatedSubmissions);

      // Update stats
      const newThisMonth = updatedSubmissions.filter((s) => {
        const submittedDate = new Date(s.submitted_at);
        const now = new Date();
        return (
          submittedDate.getMonth() === now.getMonth() &&
          submittedDate.getFullYear() === now.getFullYear()
        );
      }).length;

      setStats({
        currentCount: updatedSubmissions.length,
        thisMonth: newThisMonth,
        hasMore: !!data.data?.next_key,
      });

      setHasMore(!!data.data?.next_key);
      setLastKey(data.data?.next_key || null);

      addToast({
        color: "success",
        title: "More submissions loaded",
        description: `Loaded ${enrichedNewSubmissions.length} more rejected submissions`,
      });
    } catch (error) {
      addToast({
        color: "danger",
        title: "Error loading more submissions",
        description: error.message || "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, lastKey, submissions, enrichWithQuestData]);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <RejectedSubmissionsHeader stats={stats} hasMore={hasMore} />

      <RejectedSubmissionsList
        hasMore={hasMore}
        isLoading={isLoading}
        submissions={submissions}
        onLoadMore={loadMoreSubmissions}
      />
    </div>
  );
};

export default RejectedSubmissionsContainer;
