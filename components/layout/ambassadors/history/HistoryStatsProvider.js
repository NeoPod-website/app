"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  Suspense,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToast } from "@heroui/react";

import {
  setLoading,
  appendHistory,
  initializeHistory,
} from "@/redux/slice/historySlice";

import HistoryNumberCard from "./HistoryNumberCard";
import HistoryGrid from "./HistoryGrid";
import HistoryHeader from "./HistoryHeader";
import WrapperContainer from "@/components/common/WrapperContainer";
import HistoryCardLoader from "@/components/ui/loader/history/HistoryCardLoader";

// Create context for sharing stats across components
const HistoryStatsContext = createContext();

export const useHistoryStats = () => {
  const context = useContext(HistoryStatsContext);
  if (!context) {
    throw new Error("useHistoryStats must be used within HistoryStatsProvider");
  }
  return context;
};

const HistoryStatsProvider = ({
  initialHistory,
  initialLastKey,
  initialHasMore,
}) => {
  const dispatch = useDispatch();

  const { history, lastKey, hasMore, isLoading } = useSelector(
    (state) => state.history,
  );

  const [isInitialized, setIsInitialized] = useState(false);

  const [stats, setStats] = useState({
    approved: { count: 0, hasMore: false, isLoading: true },
    rejected: { count: 0, hasMore: false, isLoading: true },
    highlighted: { count: 0, hasMore: false, isLoading: true },
  });

  // Track items we've seen to avoid double counting
  const [seenItems, setSeenItems] = useState({
    approved: new Set(),
    rejected: new Set(),
    highlighted: new Set(),
  });

  /**
   * Fetch initial counts for all statuses
   */
  const fetchInitialCounts = useCallback(async () => {
    try {
      const [approvedData, rejectedData, highlightedData] = await Promise.all([
        fetchSubmissionsByStatus("approved", 50),
        fetchSubmissionsByStatus("rejected", 50),
        fetchSubmissionsByStatus("highlighted", 50),
      ]);

      setStats({
        approved: {
          count: approvedData.count,
          hasMore: approvedData.hasMore,
          isLoading: false,
        },
        rejected: {
          count: rejectedData.count,
          hasMore: rejectedData.hasMore,
          isLoading: false,
        },
        highlighted: {
          count: highlightedData.count,
          hasMore: highlightedData.hasMore,
          isLoading: false,
        },
      });

      // Track initial seen items
      setSeenItems({
        approved: new Set(approvedData.submissions.map((s) => s.submission_id)),
        rejected: new Set(rejectedData.submissions.map((s) => s.submission_id)),
        highlighted: new Set(
          highlightedData.submissions.map((s) => s.submission_id),
        ),
      });
    } catch (error) {
      console.error("Failed to fetch initial counts:", error);
      setStats((prev) => ({
        approved: { ...prev.approved, isLoading: false },
        rejected: { ...prev.rejected, isLoading: false },
        highlighted: { ...prev.highlighted, isLoading: false },
      }));
    }
  }, []);

  /**
   * Update counts when new submissions are loaded
   */
  const updateCounts = useCallback(
    (newSubmissions) => {
      if (!newSubmissions || newSubmissions.length === 0) return;

      const newCounts = {
        approved: 0,
        rejected: 0,
        highlighted: 0,
      };

      const newSeenItems = {
        approved: new Set(seenItems.approved),
        rejected: new Set(seenItems.rejected),
        highlighted: new Set(seenItems.highlighted),
      };

      // Count new items by status
      newSubmissions.forEach((submission) => {
        const status = submission.review_status;
        const id = submission.submission_id;

        if (["approved", "rejected", "highlighted"].includes(status)) {
          if (!newSeenItems[status].has(id)) {
            newCounts[status]++;
            newSeenItems[status].add(id);
          }
        }
      });

      // Update stats if we found new items
      if (
        newCounts.approved > 0 ||
        newCounts.rejected > 0 ||
        newCounts.highlighted > 0
      ) {
        setStats((prev) => ({
          approved: {
            ...prev.approved,
            count: prev.approved.count + newCounts.approved,
          },
          rejected: {
            ...prev.rejected,
            count: prev.rejected.count + newCounts.rejected,
          },
          highlighted: {
            ...prev.highlighted,
            count: prev.highlighted.count + newCounts.highlighted,
          },
        }));

        setSeenItems(newSeenItems);
      }
    },
    [seenItems],
  );

  /**
   * Refresh all counts (for pull-to-refresh)
   */
  const refreshCounts = useCallback(() => {
    setStats((prev) => ({
      approved: { ...prev.approved, isLoading: true },
      rejected: { ...prev.rejected, isLoading: true },
      highlighted: { ...prev.highlighted, isLoading: true },
    }));

    setSeenItems({
      approved: new Set(),
      rejected: new Set(),
      highlighted: new Set(),
    });

    fetchInitialCounts();
  }, [fetchInitialCounts]);

  // Initialize history on component mount - only once
  useEffect(() => {
    if (!isInitialized && initialHistory) {
      const initialData = {
        history: initialHistory || [],
        lastKey: initialLastKey || null,
        hasMore: initialHasMore && initialHistory?.length > 0,
      };

      dispatch(initializeHistory(initialData));

      // Update counts with initial data
      updateCounts(initialHistory);

      setIsInitialized(true);
    }
  }, [
    dispatch,
    initialHistory,
    initialLastKey,
    initialHasMore,
    isInitialized,
    updateCounts,
  ]);

  // Fetch initial counts on mount
  useEffect(() => {
    fetchInitialCounts();
  }, [fetchInitialCounts]);

  /**
   * Fetch quest details for new history submissions
   */
  const enrichHistoryWithQuestData = useCallback(async (history) => {
    if (!history || history.length === 0) {
      return [];
    }

    try {
      // Get unique quest IDs from new history
      const questIds = [...new Set(history.map((sub) => sub.quest_id))];

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

      // Enrich history with quest data
      const enrichedHistory = history.map((submission) => {
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

      return enrichedHistory;
    } catch (error) {
      console.error("Error enriching history with quest data:", error);
      return history; // Return original history if enrichment fails
    }
  }, []);

  /**
   * Fetches more history with pagination
   */
  const fetchMoreHistory = useCallback(async () => {
    if (isLoading || !hasMore || !lastKey) return;

    try {
      dispatch(setLoading(true));

      // Build query parameters
      const params = new URLSearchParams({
        limit: "10",
        last_key: lastKey,
        status: "history", // Get approved + rejected
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch history: ${response.status}`);
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
          description: "You've reached the end of your submission history",
        });
        return;
      }

      // Enrich new history with quest data
      const enrichedNewHistory = await enrichHistoryWithQuestData(newHistory);

      // Update history in state
      dispatch(
        appendHistory({
          history: enrichedNewHistory,
          lastKey: data.data?.next_key || null,
          hasMore: !!data.data?.next_key,
        }),
      );

      // Update counts with new data
      updateCounts(enrichedNewHistory);
    } catch (error) {
      addToast({
        color: "danger",
        title: "Error loading more history",
        description: error.message || "Please try again",
      });

      // Reset hasMore to false on error to prevent infinite retry
      dispatch(
        appendHistory({
          history: [],
          lastKey: null,
          hasMore: false,
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }, [
    dispatch,
    hasMore,
    isLoading,
    lastKey,
    enrichHistoryWithQuestData,
    updateCounts,
  ]);

  /**
   * Handle refresh history (pull to refresh or manual refresh)
   */
  const handleRefreshHistory = useCallback(async () => {
    try {
      dispatch(setLoading(true));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions?limit=10&status=history`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store", // Force fresh data
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to refresh history: ${response.status}`);
      }

      const data = await response.json();
      const refreshedHistory = data.data?.submissions || [];

      // Enrich with quest data
      const enrichedHistory =
        await enrichHistoryWithQuestData(refreshedHistory);

      // Replace all history with fresh data
      dispatch(
        initializeHistory({
          history: enrichedHistory,
          lastKey: data.data?.next_key || null,
          hasMore: !!data.data?.next_key,
        }),
      );

      // Refresh all counts
      refreshCounts();

      addToast({
        color: "success",
        title: "History updated",
        description: `Loaded ${enrichedHistory.length} recent submissions`,
      });
    } catch (error) {
      addToast({
        color: "danger",
        title: "Error refreshing history",
        description: error.message || "Please try again",
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, enrichHistoryWithQuestData, refreshCounts]);

  const contextValue = {
    stats,
    updateCounts,
    refreshCounts,
  };

  return (
    <HistoryStatsContext.Provider value={contextValue}>
      {/* Status Cards */}
      <div className="mb-6 flex gap-4">
        <HistoryNumberCard
          title="Total approved Tasks"
          count={stats.approved.count}
          hasMore={stats.approved.hasMore}
          href="/submissions/approved"
          color="text-green-500"
          isLoading={stats.approved.isLoading}
        />

        <HistoryNumberCard
          title="Total Rejected Tasks"
          count={stats.rejected.count}
          hasMore={stats.rejected.hasMore}
          href="/submissions/rejected"
          color="text-red-500"
          isLoading={stats.rejected.isLoading}
        />

        <HistoryNumberCard
          title="Total Highlighted Tasks"
          count={stats.highlighted.count}
          hasMore={stats.highlighted.hasMore}
          href="/submissions/highlighted"
          color="text-yellow-500"
          isLoading={stats.highlighted.isLoading}
        />
      </div>

      {/* History Content */}
      <WrapperContainer scrollable={true}>
        <HistoryHeader
          hasMore={hasMore}
          isLoading={isLoading}
          count={history.length}
          onRefresh={handleRefreshHistory}
        />

        <Suspense>
          <div className="hide-scroll flex flex-1 flex-col overflow-y-auto">
            {isInitialized ? (
              <HistoryGrid
                hasMore={hasMore}
                isLoading={isLoading}
                history={history}
                onRefresh={handleRefreshHistory}
                loadMoreHistory={fetchMoreHistory}
              />
            ) : (
              [...Array(6)].map((_, index) => <HistoryCardLoader key={index} />)
            )}
          </div>
        </Suspense>
      </WrapperContainer>
    </HistoryStatsContext.Provider>
  );
};

/**
 * Helper function to fetch submissions by status
 */
const fetchSubmissionsByStatus = async (status, limit = 50) => {
  const params = new URLSearchParams({
    limit: limit.toString(),
    status: status,
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/submissions?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      return { submissions: [], hasMore: false, count: 0 };
    }
    throw new Error(
      `Failed to fetch ${status} submissions: ${response.status}`,
    );
  }

  const data = await response.json();

  return {
    submissions: data.data?.submissions || [],
    hasMore: !!data.data?.next_key,
    count: data.data?.submissions?.length || 0,
  };
};

export default HistoryStatsProvider;
