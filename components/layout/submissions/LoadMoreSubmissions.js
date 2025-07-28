"use client";

import { addToast } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback, Suspense } from "react";

import {
  setLoading,
  appendSubmissions,
  initializeSubmissions,
} from "@/redux/slice/submissionsSlice";

import SubmissionsGrid from "./SubmissionsGrid";
import SubmissionsHeader from "./SubmissionsHeader";

import WrapperContainer from "@/components/common/WrapperContainer";
import SubmissionCardLoader from "@/components/ui/loader/submission/SubmissionCardLoader";

export default function LoadMoreSubmissions({
  initialLastKey,
  initialHasMore,
  initialSubmissions,
}) {
  const dispatch = useDispatch();

  const { submissions, lastKey, hasMore, isLoading } = useSelector(
    (state) => state.submissions,
  );

  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize submissions on component mount - only once
  useEffect(() => {
    if (!isInitialized && initialSubmissions) {
      const initialData = {
        submissions: initialSubmissions || [],
        lastKey: initialLastKey || null,
        hasMore: initialHasMore && initialSubmissions?.length > 0,
      };

      dispatch(initializeSubmissions(initialData));
      setIsInitialized(true);
    }
  }, [
    dispatch,
    initialSubmissions,
    initialLastKey,
    initialHasMore,
    isInitialized,
  ]);

  /**
   * Fetch quest details for new submissions
   */
  const enrichSubmissionsWithQuestData = useCallback(async (submissions) => {
    if (!submissions || submissions.length === 0) {
      return [];
    }

    try {
      // Get unique quest IDs from new submissions
      const questIds = [...new Set(submissions.map((sub) => sub.quest_id))];

      // Fetch quest details for all quests
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

      // Enrich submissions with quest data
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
      console.error("Error enriching submissions with quest data:", error);
      return submissions; // Return original submissions if enrichment fails
    }
  }, []);

  /**
   * Fetches more submissions with pagination (REAL API VERSION)
   */
  const fetchMoreSubmissions = useCallback(async () => {
    if (isLoading || !hasMore || !lastKey) return;

    try {
      dispatch(setLoading(true));

      // Build query parameters
      const params = new URLSearchParams({
        limit: "10",
        last_key: lastKey,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions/pending?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch submissions: ${response.status}`);
      }

      const data = await response.json();

      // Filter only submissions that are under review (editable)
      const newSubmissions = (data.data?.submissions || []).filter(
        (submission) =>
          ["pending", "in_progress"].includes(submission.review_status),
      );

      if (newSubmissions.length === 0) {
        dispatch(
          appendSubmissions({
            submissions: [],
            lastKey: null,
            hasMore: false,
          }),
        );

        addToast({
          color: "default",
          title: "No more submissions",
          description: "You've reached the end of your pending submissions",
        });
        return;
      }

      // Enrich new submissions with quest data
      const enrichedNewSubmissions =
        await enrichSubmissionsWithQuestData(newSubmissions);

      // Update submissions in state
      dispatch(
        appendSubmissions({
          submissions: enrichedNewSubmissions,
          lastKey: data.data?.next_key || null,
          hasMore: !!data.data?.next_key,
        }),
      );
    } catch (error) {
      addToast({
        color: "danger",
        title: "Error loading more submissions",
        description: error.message || "Please try again",
      });

      // Reset hasMore to false on error to prevent infinite retry
      dispatch(
        appendSubmissions({
          submissions: [],
          lastKey: null,
          hasMore: false,
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, hasMore, isLoading, lastKey, enrichSubmissionsWithQuestData]);

  /**
   * Handle refresh submissions (pull to refresh or manual refresh)
   */
  const handleRefreshSubmissions = useCallback(async () => {
    try {
      dispatch(setLoading(true));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions?limit=10`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store", // Force fresh data
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to refresh submissions: ${response.status}`);
      }

      const data = await response.json();

      // Filter only submissions that are under review
      const refreshedSubmissions = (data.data?.submissions || []).filter(
        (submission) =>
          ["pending", "in_progress"].includes(submission.review_status),
      );

      // Enrich with quest data
      const enrichedSubmissions =
        await enrichSubmissionsWithQuestData(refreshedSubmissions);

      // Replace all submissions with fresh data
      dispatch(
        initializeSubmissions({
          submissions: enrichedSubmissions,
          lastKey: data.data?.next_key || null,
          hasMore: !!data.data?.next_key,
        }),
      );

      addToast({
        color: "success",
        title: "Submissions updated",
        description: `Loaded ${enrichedSubmissions.length} pending submissions`,
      });
    } catch (error) {
      addToast({
        color: "danger",
        title: "Error refreshing submissions",
        description: error.message || "Please try again",
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, enrichSubmissionsWithQuestData]);

  return (
    <WrapperContainer
      scrollable={false}
      className="hide-scroll flex flex-col overflow-y-auto p-3 md:overflow-hidden md:p-4 lg:p-6 3xl:p-8"
    >
      <SubmissionsHeader
        hasMore={hasMore}
        isLoading={isLoading}
        count={submissions.length}
        onRefresh={handleRefreshSubmissions}
      />

      <Suspense>
        <div className="flex flex-1 flex-col md:overflow-y-auto">
          {isInitialized ? (
            <SubmissionsGrid
              hasMore={hasMore}
              isLoading={isLoading}
              submissions={submissions}
              onRefresh={handleRefreshSubmissions}
              loadMoreSubmissions={fetchMoreSubmissions}
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 px-8 pb-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <SubmissionCardLoader key={index} />
              ))}
            </div>
          )}
        </div>
      </Suspense>
    </WrapperContainer>
  );
}
