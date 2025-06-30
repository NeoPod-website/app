// "use client";

// import { addToast } from "@heroui/react";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState, useCallback, Suspense } from "react";

// import {
//   setLoading,
//   appendHistory,
//   initializeHistory,
// } from "@/redux/slice/historySlice";

// import HistoryGrid from "./HistoryGrid";
// import HistoryHeader from "./HistoryHeader";

// import WrapperContainer from "@/components/common/WrapperContainer";
// import HistoryCardLoader from "@/components/ui/loader/history/HistoryCardLoader";

// export default function LoadMoreHistory({
//   initialLastKey,
//   initialHasMore,
//   initialHistory,
// }) {
//   const dispatch = useDispatch();

//   const { history, lastKey, hasMore, isLoading } = useSelector(
//     (state) => state.history,
//   );

//   const [isInitialized, setIsInitialized] = useState(false);

//   // Initialize history on component mount - only once
//   useEffect(() => {
//     if (!isInitialized && initialHistory) {
//       const initialData = {
//         history: initialHistory || [],
//         lastKey: initialLastKey || null,
//         hasMore: initialHasMore && initialHistory?.length > 0,
//       };

//       dispatch(initializeHistory(initialData));
//       setIsInitialized(true);
//     }
//   }, [dispatch, initialHistory, initialLastKey, initialHasMore, isInitialized]);

//   /**
//    * Fetch quest details for new history submissions
//    */
//   const enrichHistoryWithQuestData = useCallback(async (history) => {
//     if (!history || history.length === 0) {
//       return [];
//     }

//     try {
//       // Get unique quest IDs from new history
//       const questIds = [...new Set(history.map((sub) => sub.quest_id))];

//       // Fetch quest details for all quests
//       const questPromises = questIds.map(async (questId) => {
//         try {
//           const response = await fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/quests/${questId}`,
//             {
//               method: "GET",
//               credentials: "include",
//             },
//           );

//           if (response.ok) {
//             const questData = await response.json();
//             return {
//               quest_id: questId,
//               quest_data: questData.data?.quest || null,
//             };
//           }
//           return { quest_id: questId, quest_data: null };
//         } catch (error) {
//           console.error(`Error fetching quest ${questId}:`, error);
//           return { quest_id: questId, quest_data: null };
//         }
//       });

//       const questResults = await Promise.all(questPromises);
//       const questMap = questResults.reduce((acc, result) => {
//         if (result.quest_data) {
//           acc[result.quest_id] = result.quest_data;
//         }
//         return acc;
//       }, {});

//       // Enrich history with quest data
//       const enrichedHistory = history.map((submission) => {
//         const questData = questMap[submission.quest_id];

//         return {
//           ...submission,
//           quest_name: questData?.name || "Unknown Quest",
//           quest_description: questData?.description || "",
//           quest_tasks: questData?.tasks || [],
//           quest_rewards: questData?.rewards || [],
//           category_name: questData?.category_name || "Unknown Category",
//           pod_name: questData?.pod_name || "Unknown Pod",
//           original_quest_data: questData,
//         };
//       });

//       return enrichedHistory;
//     } catch (error) {
//       console.error("Error enriching history with quest data:", error);
//       return history; // Return original history if enrichment fails
//     }
//   }, []);

//   /**
//    * Fetches more history with pagination
//    */
//   const fetchMoreHistory = useCallback(async () => {
//     if (isLoading || !hasMore || !lastKey) return;

//     try {
//       dispatch(setLoading(true));

//       // Build query parameters
//       const params = new URLSearchParams({
//         limit: "10",
//         last_key: lastKey,
//       });

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/submissions?${params.toString()}`,
//         {
//           method: "GET",
//           credentials: "include",
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to fetch history: ${response.status}`);
//       }

//       const data = await response.json();

//       // Filter only submissions that are completed (rejected, highlighted, accepted)
//       const newHistory = (data.data?.submissions || []).filter((submission) =>
//         ["rejected", "highlighted", "accepted"].includes(
//           submission.review_status,
//         ),
//       );

//       if (newHistory.length === 0) {
//         dispatch(
//           appendHistory({
//             history: [],
//             lastKey: null,
//             hasMore: false,
//           }),
//         );

//         addToast({
//           color: "default",
//           title: "No more history",
//           description: "You've reached the end of your submission history",
//         });
//         return;
//       }

//       // Enrich new history with quest data
//       const enrichedNewHistory = await enrichHistoryWithQuestData(newHistory);

//       // Update history in state
//       dispatch(
//         appendHistory({
//           history: enrichedNewHistory,
//           lastKey: data.data?.next_key || null,
//           hasMore: !!data.data?.next_key,
//         }),
//       );
//     } catch (error) {
//       addToast({
//         color: "danger",
//         title: "Error loading more history",
//         description: error.message || "Please try again",
//       });

//       // Reset hasMore to false on error to prevent infinite retry
//       dispatch(
//         appendHistory({
//           history: [],
//           lastKey: null,
//           hasMore: false,
//         }),
//       );
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }, [dispatch, hasMore, isLoading, lastKey, enrichHistoryWithQuestData]);

//   /**
//    * Handle refresh history (pull to refresh or manual refresh)
//    */
//   const handleRefreshHistory = useCallback(async () => {
//     try {
//       dispatch(setLoading(true));

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/submissions?limit=10`,
//         {
//           method: "GET",
//           credentials: "include",
//           cache: "no-store", // Force fresh data
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to refresh history: ${response.status}`);
//       }

//       const data = await response.json();

//       // Filter only submissions that are completed
//       const refreshedHistory = (data.data?.submissions || []).filter(
//         (submission) =>
//           ["rejected", "highlighted", "accepted"].includes(
//             submission.review_status,
//           ),
//       );

//       // Enrich with quest data
//       const enrichedHistory =
//         await enrichHistoryWithQuestData(refreshedHistory);

//       // Replace all history with fresh data
//       dispatch(
//         initializeHistory({
//           history: enrichedHistory,
//           lastKey: data.data?.next_key || null,
//           hasMore: !!data.data?.next_key,
//         }),
//       );

//       addToast({
//         color: "success",
//         title: "History updated",
//         description: `Loaded ${enrichedHistory.length} completed submissions`,
//       });
//     } catch (error) {
//       addToast({
//         color: "danger",
//         title: "Error refreshing history",
//         description: error.message || "Please try again",
//       });
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }, [dispatch, enrichHistoryWithQuestData]);

//   return (
//     <WrapperContainer scrollable={true}>
//       <HistoryHeader
//         hasMore={hasMore}
//         isLoading={isLoading}
//         count={history.length}
//         onRefresh={handleRefreshHistory}
//       />

//       <Suspense>
//         <div className="hide-scroll flex flex-1 flex-col overflow-y-auto">
//           {isInitialized ? (
//             <HistoryGrid
//               hasMore={hasMore}
//               isLoading={isLoading}
//               history={history}
//               onRefresh={handleRefreshHistory}
//               loadMoreHistory={fetchMoreHistory}
//             />
//           ) : (
//             [...Array(6)].map((_, index) => <HistoryCardLoader key={index} />)
//           )}
//         </div>
//       </Suspense>
//     </WrapperContainer>
//   );
// }

// "use client";

// import { addToast } from "@heroui/react";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState, useCallback, Suspense } from "react";

// import {
//   setLoading,
//   appendHistory,
//   initializeHistory,
// } from "@/redux/slice/historySlice";

// import HistoryGrid from "./HistoryGrid";
// import HistoryHeader from "./HistoryHeader";
// import { useHistoryStats } from "./HistoryStatsProvider";

// import WrapperContainer from "@/components/common/WrapperContainer";
// import HistoryCardLoader from "@/components/ui/loader/history/HistoryCardLoader";

// export default function LoadMoreHistory({
//   initialLastKey,
//   initialHasMore,
//   initialHistory,
// }) {
//   const dispatch = useDispatch();
//   const { updateCounts, refreshCounts } = useHistoryStats();

//   const { history, lastKey, hasMore, isLoading } = useSelector(
//     (state) => state.history,
//   );

//   const [isInitialized, setIsInitialized] = useState(false);

//   // Initialize history on component mount - only once
//   useEffect(() => {
//     if (!isInitialized && initialHistory) {
//       const initialData = {
//         history: initialHistory || [],
//         lastKey: initialLastKey || null,
//         hasMore: initialHasMore && initialHistory?.length > 0,
//       };

//       dispatch(initializeHistory(initialData));

//       // Update counts with initial data
//       updateCounts(initialHistory);

//       setIsInitialized(true);
//     }
//   }, [
//     dispatch,
//     initialHistory,
//     initialLastKey,
//     initialHasMore,
//     isInitialized,
//     updateCounts,
//   ]);

//   /**
//    * Fetch quest details for new history submissions
//    */
//   const enrichHistoryWithQuestData = useCallback(async (history) => {
//     if (!history || history.length === 0) {
//       return [];
//     }

//     try {
//       // Get unique quest IDs from new history
//       const questIds = [...new Set(history.map((sub) => sub.quest_id))];

//       // Fetch quest details for all quests
//       const questPromises = questIds.map(async (questId) => {
//         try {
//           const response = await fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/quests/${questId}`,
//             {
//               method: "GET",
//               credentials: "include",
//             },
//           );

//           if (response.ok) {
//             const questData = await response.json();
//             return {
//               quest_id: questId,
//               quest_data: questData.data?.quest || null,
//             };
//           }
//           return { quest_id: questId, quest_data: null };
//         } catch (error) {
//           console.error(`Error fetching quest ${questId}:`, error);
//           return { quest_id: questId, quest_data: null };
//         }
//       });

//       const questResults = await Promise.all(questPromises);
//       const questMap = questResults.reduce((acc, result) => {
//         if (result.quest_data) {
//           acc[result.quest_id] = result.quest_data;
//         }
//         return acc;
//       }, {});

//       // Enrich history with quest data
//       const enrichedHistory = history.map((submission) => {
//         const questData = questMap[submission.quest_id];

//         return {
//           ...submission,
//           quest_name: questData?.name || "Unknown Quest",
//           quest_description: questData?.description || "",
//           quest_tasks: questData?.tasks || [],
//           quest_rewards: questData?.rewards || [],
//           category_name: questData?.category_name || "Unknown Category",
//           pod_name: questData?.pod_name || "Unknown Pod",
//           original_quest_data: questData,
//         };
//       });

//       return enrichedHistory;
//     } catch (error) {
//       console.error("Error enriching history with quest data:", error);
//       return history; // Return original history if enrichment fails
//     }
//   }, []);

//   /**
//    * Fetches more history with pagination
//    */
//   const fetchMoreHistory = useCallback(async () => {
//     if (isLoading || !hasMore || !lastKey) return;

//     try {
//       dispatch(setLoading(true));

//       // Build query parameters
//       const params = new URLSearchParams({
//         limit: "10",
//         last_key: lastKey,
//         status: "history", // Get accepted + rejected
//       });

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/submissions?${params.toString()}`,
//         {
//           method: "GET",
//           credentials: "include",
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to fetch history: ${response.status}`);
//       }

//       const data = await response.json();
//       const newHistory = data.data?.submissions || [];

//       if (newHistory.length === 0) {
//         dispatch(
//           appendHistory({
//             history: [],
//             lastKey: null,
//             hasMore: false,
//           }),
//         );

//         addToast({
//           color: "default",
//           title: "No more history",
//           description: "You've reached the end of your submission history",
//         });
//         return;
//       }

//       // Enrich new history with quest data
//       const enrichedNewHistory = await enrichHistoryWithQuestData(newHistory);

//       // Update history in state
//       dispatch(
//         appendHistory({
//           history: enrichedNewHistory,
//           lastKey: data.data?.next_key || null,
//           hasMore: !!data.data?.next_key,
//         }),
//       );

//       // Update counts with new data
//       updateCounts(enrichedNewHistory);
//     } catch (error) {
//       addToast({
//         color: "danger",
//         title: "Error loading more history",
//         description: error.message || "Please try again",
//       });

//       // Reset hasMore to false on error to prevent infinite retry
//       dispatch(
//         appendHistory({
//           history: [],
//           lastKey: null,
//           hasMore: false,
//         }),
//       );
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }, [
//     dispatch,
//     hasMore,
//     isLoading,
//     lastKey,
//     enrichHistoryWithQuestData,
//     updateCounts,
//   ]);

//   /**
//    * Handle refresh history (pull to refresh or manual refresh)
//    */
//   const handleRefreshHistory = useCallback(async () => {
//     try {
//       dispatch(setLoading(true));

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/submissions?limit=10&status=history`,
//         {
//           method: "GET",
//           credentials: "include",
//           cache: "no-store", // Force fresh data
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to refresh history: ${response.status}`);
//       }

//       const data = await response.json();
//       const refreshedHistory = data.data?.submissions || [];

//       // Enrich with quest data
//       const enrichedHistory =
//         await enrichHistoryWithQuestData(refreshedHistory);

//       // Replace all history with fresh data
//       dispatch(
//         initializeHistory({
//           history: enrichedHistory,
//           lastKey: data.data?.next_key || null,
//           hasMore: !!data.data?.next_key,
//         }),
//       );

//       // Refresh all counts
//       refreshCounts();

//       addToast({
//         color: "success",
//         title: "History updated",
//         description: `Loaded ${enrichedHistory.length} recent submissions`,
//       });
//     } catch (error) {
//       addToast({
//         color: "danger",
//         title: "Error refreshing history",
//         description: error.message || "Please try again",
//       });
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }, [dispatch, enrichHistoryWithQuestData, refreshCounts]);

//   return (
//     <WrapperContainer scrollable={true}>
//       <HistoryHeader
//         hasMore={hasMore}
//         isLoading={isLoading}
//         count={history.length}
//         onRefresh={handleRefreshHistory}
//       />

//       <Suspense>
//         <div className="hide-scroll flex flex-1 flex-col overflow-y-auto">
//           {isInitialized ? (
//             <HistoryGrid
//               hasMore={hasMore}
//               isLoading={isLoading}
//               history={history}
//               onRefresh={handleRefreshHistory}
//               loadMoreHistory={fetchMoreHistory}
//             />
//           ) : (
//             [...Array(6)].map((_, index) => <HistoryCardLoader key={index} />)
//           )}
//         </div>
//       </Suspense>
//     </WrapperContainer>
//   );
// }

"use client";

import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@heroui/react";
import { addToast } from "@heroui/react";

import {
  initializeHistory,
  appendHistory,
  setHistoryLoading,
  setError,
} from "@/redux/slice/historySlice";

import HistoryItemCard from "@/components/layout/ambassadors/history/HistoryItemCard";

const HistorySection = ({ initialHistory, initialLastKey, initialHasMore }) => {
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
    <div className="flex flex-1 flex-col space-y-4 overflow-y-auto scrollbar-hide">
      {history.map((submission) => (
        <HistoryItemCard
          key={submission.submission_id}
          submission={submission}
        />
      ))}

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
          <p className="text-gray-400">You've reached the end</p>
        </div>
      )}
    </div>
  );
};

export default HistorySection;
