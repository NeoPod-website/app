// import React from "react";

// import HistoryItemCard from "@/components/layout/ambassadors/history/HistoryItemCard";

// const submissionsData = [
//   {
//     submission_id: "sub_001",
//     ambassador_id: "amb_123",
//     submitted_at: "2025-06-11T23:30:00Z",
//     review_status: "rejected",
//     reviewed_by: "admin_001",
//     review_comment:
//       "Content does not meet quality standards. Please ensure your tweet includes proper hashtags and mentions the NeoPod program clearly. Content does not meet quality standards. Please ensure your tweet includes proper hashtags and mentions the NeoPod program clearly. Content does not meet quality standards. Please ensure your tweet includes proper hashtags and mentions the NeoPod program clearly.",
//     is_flagged: "false",
//     resubmission_count: 1,
//     quest_name: "Share a Tweet on NeoPod Ambassador Program",
//   },
//   {
//     submission_id: "sub_002",
//     ambassador_id: "amb_456",
//     submitted_at: "2025-06-11T11:45:00Z",
//     review_status: "rejected",
//     reviewed_by: "admin_002",
//     review_comment:
//       "Missing required hashtags and the engagement metrics are below the minimum threshold. Please resubmit with proper formatting.",
//     is_flagged: "false",
//     resubmission_count: 0,
//     quest_name: "Create Instagram Story for NEO Community",
//   },
//   {
//     submission_id: "sub_003",
//     ambassador_id: "amb_789",
//     submitted_at: "2025-06-11T14:15:00Z",
//     review_status: "approved",
//     reviewed_by: "admin_001",
//     review_comment:
//       "Excellent work! Your tweet generated great engagement and perfectly represents the NeoPod values. Keep up the outstanding work.",
//     is_flagged: "false",
//     resubmission_count: 0,
//     quest_name: "Share a Tweet on NeoPod Ambassador Program",
//   },
//   {
//     submission_id: "sub_004",
//     ambassador_id: "amb_321",
//     submitted_at: "2025-06-10T09:20:00Z",
//     review_status: "approved",
//     reviewed_by: "admin_003",
//     review_comment:
//       "Great content with impressive engagement metrics. The video quality is excellent and the message is clear and compelling.",
//     is_flagged: "false",
//     resubmission_count: 0,
//     quest_name: "Create Educational Video about NEO Blockchain",
//   },
//   {
//     submission_id: "sub_005",
//     ambassador_id: "amb_654",
//     submitted_at: "2025-06-09T16:30:00Z",
//     review_status: "pending",
//     reviewed_by: null,
//     review_comment: null,
//     is_flagged: "false",
//     resubmission_count: 0,
//     quest_name: "Write Blog Post about NEO Ecosystem",
//   },
//   {
//     submission_id: "sub_006",
//     ambassador_id: "amb_987",
//     submitted_at: "2025-06-08T13:45:00Z",
//     review_status: "approved",
//     reviewed_by: "admin_002",
//     review_comment:
//       "Fantastic community engagement! Your post sparked meaningful discussions and provided valuable insights to the community.",
//     is_flagged: "false",
//     resubmission_count: 0,
//     quest_name: "Host Community Discussion on NEO Features",
//   },
//   {
//     submission_id: "sub_007",
//     ambassador_id: "amb_111",
//     submitted_at: "2025-06-07T08:00:00Z",
//     review_status: "rejected",
//     reviewed_by: "admin_001",
//     review_comment:
//       "The content lacks depth and doesn't adequately explain the technical concepts. Please provide more detailed explanations and examples.",
//     is_flagged: "false",
//     resubmission_count: 2,
//     quest_name: "Create Tutorial on NEO Smart Contracts",
//   },
//   {
//     submission_id: "sub_008",
//     ambassador_id: "amb_222",
//     submitted_at: "2025-06-06T19:30:00Z",
//     review_status: "approved",
//     reviewed_by: "admin_003",
//     review_comment:
//       "Perfect execution! The infographic is visually appealing and contains accurate, up-to-date information about NEO's roadmap.",
//     is_flagged: "false",
//     resubmission_count: 0,
//     quest_name: "Design Infographic for NEO Roadmap",
//   },
// ];

// const page = () => {
//   return (
//     <div className="flex flex-1 flex-col space-y-4 overflow-y-auto scrollbar-hide">
//       {submissionsData.map((submission) => (
//         <HistoryItemCard
//           key={submission.submission_id}
//           submission={submission}
//         />
//       ))}
//     </div>
//   );
// };

// export default page;

// import { cookies } from "next/headers";
// import React, { Suspense } from "react";
// import { notFound } from "next/navigation";

// import LoadMoreHistory from "@/components/layout/ambassadors/history/LoadMoreHistory";
// import HistoryNumberCard from "@/components/layout/ambassadors/history/HistoryNumberCard";

// export const metadata = {
//   title: "Submission History | NeoPod",
//   description:
//     "View your completed quest submissions - accepted, rejected, and highlighted.",
// };

// /**
//  * Fetch user's submission history from the backend
//  * Only fetches submissions that are completed (rejected, highlighted, accepted)
//  */
// const fetchMyHistory = async (limit = 10, lastKey = null) => {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("neo-jwt");

//   if (!token?.value) {
//     throw new Error("Authentication token not found");
//   }

//   // Build query parameters
//   const params = new URLSearchParams({
//     limit: limit.toString(),
//   });

//   if (lastKey) {
//     params.append("last_key", lastKey);
//   }

//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/submissions/history?${params.toString()}`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token.value}`,
//       },
//       credentials: "include",
//       cache: "no-store", // Always fetch fresh data for history
//     },
//   );

//   if (!response.ok) {
//     if (response.status === 404) {
//       notFound();
//     }

//     if (response.status === 403) {
//       notFound();
//     }

//     throw new Error(`Failed to fetch submission history: ${response.status}`);
//   }

//   const data = await response.json();

//   return {
//     history: data.data?.submissions || [],
//     pagination: {
//       hasMore: !!data.data?.next_key,
//       lastKey: data.data?.next_key || null,
//     },
//   };
// };

// /**
//  * Fetch quest details for history submissions to enrich the data
//  * This adds quest names, categories, etc. to the submission data
//  */
// const enrichHistoryWithQuestData = async (history) => {
//   if (!history || history.length === 0) {
//     return [];
//   }

//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("neo-jwt");

//     if (!token?.value) {
//       return history; // Return as-is if no token
//     }

//     // Get unique quest IDs
//     const questIds = [...new Set(history.map((sub) => sub.quest_id))];

//     // Fetch quest details for all quests
//     const questPromises = questIds.map(async (questId) => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/quests/${questId}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token.value}`,
//             },
//             credentials: "include",
//             cache: "force-cache", // Cache quest data since it changes less frequently
//           },
//         );

//         if (response.ok) {
//           const questData = await response.json();

//           return {
//             quest_id: questId,
//             quest_data: questData.data?.quest || null,
//           };
//         }

//         return { quest_id: questId, quest_data: null };
//       } catch (error) {
//         console.error(`Error fetching quest ${questId}:`, error);
//         return { quest_id: questId, quest_data: null };
//       }
//     });

//     const questResults = await Promise.all(questPromises);
//     const questMap = questResults.reduce((acc, result) => {
//       if (result.quest_data) {
//         acc[result.quest_id] = result.quest_data;
//       }
//       return acc;
//     }, {});

//     // Enrich history with quest data
//     const enrichedHistory = history.map((submission) => {
//       const questData = questMap[submission.quest_id];

//       return {
//         ...submission,
//         // Add quest information
//         quest_name: questData?.name || "Unknown Quest",
//         quest_description: questData?.description || "",
//         quest_tasks: questData?.tasks || [],
//         quest_rewards: questData?.rewards || [],
//         category_name: questData?.category_name || "Unknown Category",
//         pod_name: questData?.pod_name || "Unknown Pod",
//         // Keep original data
//         original_quest_data: questData,
//       };
//     });

//     return enrichedHistory;
//   } catch (error) {
//     return history; // Return original history if enrichment fails
//   }
// };

// const HistoryPage = async () => {
//   // Fetch initial history (first page)
//   const historyData = await fetchMyHistory(10);

//   // Enrich history with quest data
//   const enrichedHistory = await enrichHistoryWithQuestData(historyData.history);

//   return (
//     <>
//     <div className="flex gap-4">
//       <HistoryNumberCard
//         title="Total Accepted Task"
//         count={24}
//         href="/submissions/accepted"
//         color="text-green-500"
//       />

//       <HistoryNumberCard
//         title="Total Rejected Task"
//         count={24}
//         href="/submissions/rejected"
//         color="text-red-500"
//       />

//       <HistoryNumberCard
//         title="Total Highlighted Task"
//         count={24}
//         href="/submissions/highlighted"
//         color="text-yellow-500"
//       />
//     </div>

//     <Suspense>
//       <LoadMoreHistory
//         initialHistory={enrichedHistory}
//         initialLastKey={historyData.pagination.lastKey}
//         initialHasMore={historyData.pagination.hasMore}
//       />
//     </Suspense>
//     </>
//   );
// };

// export default HistoryPage;

// import React from "react";
// import { cookies } from "next/headers";
// import { notFound } from "next/navigation";

// import HistoryStatsProvider from "@/components/layout/ambassadors/history/HistoryStatsProvider";

// export const metadata = {
//   title: "Submission History | NeoPod",
//   description:
//     "View your completed quest submissions - accepted, rejected, and highlighted.",
// };

// /**
//  * Fetch user's submission history for the main list (accepted + rejected)
//  */
// const fetchMyHistory = async (limit = 10, lastKey = null) => {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("neo-jwt");

//   if (!token?.value) {
//     throw new Error("Authentication token not found");
//   }

//   const params = new URLSearchParams({
//     limit: limit.toString(),
//     status: "history", // This will get accepted + rejected
//   });

//   if (lastKey) {
//     params.append("last_key", lastKey);
//   }

//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/submissions?${params.toString()}`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token.value}`,
//       },
//       credentials: "include",
//       cache: "no-store",
//     },
//   );

//   if (!response.ok) {
//     if (response.status === 404) {
//       notFound();
//     }

//     if (response.status === 403) {
//       notFound();
//     }

//     throw new Error(`Failed to fetch submission history: ${response.status}`);
//   }

//   const data = await response.json();

//   return {
//     history: data.data?.submissions || [],
//     pagination: {
//       hasMore: !!data.data?.next_key,
//       lastKey: data.data?.next_key || null,
//     },
//   };
// };

// /**
//  * Fetch quest details for history submissions to enrich the data
//  */
// const enrichHistoryWithQuestData = async (history) => {
//   if (!history || history.length === 0) {
//     return [];
//   }

//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("neo-jwt");

//     if (!token?.value) {
//       return history;
//     }

//     // Get unique quest IDs
//     const questIds = [...new Set(history.map((sub) => sub.quest_id))];

//     // Fetch quest details for all quests
//     const questPromises = questIds.map(async (questId) => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/quests/${questId}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token.value}`,
//             },
//             credentials: "include",
//             cache: "force-cache",
//           },
//         );

//         if (response.ok) {
//           const questData = await response.json();
//           return {
//             quest_id: questId,
//             quest_data: questData.data?.quest || null,
//           };
//         }

//         return { quest_id: questId, quest_data: null };
//       } catch (error) {
//         console.error(`Error fetching quest ${questId}:`, error);
//         return { quest_id: questId, quest_data: null };
//       }
//     });

//     const questResults = await Promise.all(questPromises);
//     const questMap = questResults.reduce((acc, result) => {
//       if (result.quest_data) {
//         acc[result.quest_id] = result.quest_data;
//       }
//       return acc;
//     }, {});

//     // Enrich history with quest data
//     const enrichedHistory = history.map((submission) => {
//       const questData = questMap[submission.quest_id];

//       return {
//         ...submission,
//         quest_name: questData?.name || "Unknown Quest",
//         quest_description: questData?.description || "",
//         quest_tasks: questData?.tasks || [],
//         quest_rewards: questData?.rewards || [],
//         category_name: questData?.category_name || "Unknown Category",
//         pod_name: questData?.pod_name || "Unknown Pod",
//         original_quest_data: questData,
//       };
//     });

//     return enrichedHistory;
//   } catch (error) {
//     return history;
//   }
// };

// const HistoryPage = async () => {
//   // Fetch initial history (first page)
//   const historyData = await fetchMyHistory(10);

//   // Enrich history with quest data
//   const enrichedHistory = await enrichHistoryWithQuestData(historyData.history);

//   return (
//     <HistoryStatsProvider
//       initialHistory={enrichedHistory}
//       initialLastKey={historyData.pagination.lastKey}
//       initialHasMore={historyData.pagination.hasMore}
//     />
//   );
// };

// export default HistoryPage;

// import { cookies } from "next/headers";
// import React, { Suspense } from "react";
// import { notFound } from "next/navigation";

// import LoadMoreHistory from "@/components/layout/ambassadors/history/LoadMoreHistory";
// import HistoryStatsCards from "@/components/layout/ambassadors/history/HistoryStatsCards";

// export const metadata = {
//   title: "Submission History | NeoPod",
//   description: "View your completed quest submissions - accepted and rejected.",
// };

// /**
//  * Fetch user's submission history (accepted + rejected)
//  */
// const fetchMyHistory = async (limit = 10, lastKey = null) => {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("neo-jwt");

//   if (!token?.value) {
//     throw new Error("Authentication token not found");
//   }

//   const params = new URLSearchParams({
//     limit: limit.toString(),
//   });

//   if (lastKey) {
//     params.append("last_key", lastKey);
//   }

//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/submissions/history?${params.toString()}`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token.value}`,
//       },
//       credentials: "include",
//       cache: "no-store",
//     },
//   );

//   if (!response.ok) {
//     if (response.status === 404) {
//       notFound();
//     }
//     if (response.status === 403) {
//       notFound();
//     }
//     throw new Error(`Failed to fetch submission history: ${response.status}`);
//   }

//   const data = await response.json();

//   return {
//     history: data.data?.submissions || [],
//     pagination: {
//       hasMore: !!data.data?.next_key,
//       lastKey: data.data?.next_key || null,
//     },
//   };
// };

// /**
//  * Enrich history with quest data
//  */
// const enrichHistoryWithQuestData = async (history) => {
//   if (!history || history.length === 0) {
//     return [];
//   }

//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("neo-jwt");

//     if (!token?.value) {
//       return history;
//     }

//     const questIds = [...new Set(history.map((sub) => sub.quest_id))];

//     const questPromises = questIds.map(async (questId) => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/quests/${questId}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token.value}`,
//             },
//             credentials: "include",
//             cache: "force-cache",
//           },
//         );

//         if (response.ok) {
//           const questData = await response.json();
//           return {
//             quest_id: questId,
//             quest_data: questData.data?.quest || null,
//           };
//         }

//         return { quest_id: questId, quest_data: null };
//       } catch (error) {
//         console.error(`Error fetching quest ${questId}:`, error);
//         return { quest_id: questId, quest_data: null };
//       }
//     });

//     const questResults = await Promise.all(questPromises);
//     const questMap = questResults.reduce((acc, result) => {
//       if (result.quest_data) {
//         acc[result.quest_id] = result.quest_data;
//       }
//       return acc;
//     }, {});

//     const enrichedHistory = history.map((submission) => {
//       const questData = questMap[submission.quest_id];

//       return {
//         ...submission,
//         quest_name: questData?.name || "Unknown Quest",
//         quest_description: questData?.description || "",
//         quest_tasks: questData?.tasks || [],
//         quest_rewards: questData?.rewards || [],
//         category_name: questData?.category_name || "Unknown Category",
//         pod_name: questData?.pod_name || "Unknown Pod",
//         original_quest_data: questData,
//       };
//     });

//     return enrichedHistory;
//   } catch (error) {
//     return history;
//   }
// };

// const HistoryPage = async () => {
//   // Fetch initial history
//   const historyData = await fetchMyHistory(10);

//   // Enrich history with quest data
//   const enrichedHistory = await enrichHistoryWithQuestData(historyData.history);

//   return (
//     <>
//       {/* Status Cards - will read from Redux state */}
//       <HistoryStatsCards />

//       <Suspense>
//         <LoadMoreHistory
//           initialHistory={enrichedHistory}
//           initialLastKey={historyData.pagination.lastKey}
//           initialHasMore={historyData.pagination.hasMore}
//         />
//       </Suspense>
//     </>
//   );
// };

// export default HistoryPage;

import { cookies } from "next/headers";
import React, { Suspense } from "react";

import LoadMoreHistory from "@/components/layout/ambassadors/history/LoadMoreHistory";

/**
 * Fetch history submissions (accepted + rejected)
 */
const fetchHistorySubmissions = async (limit = 10, lastKey = null) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  if (!token?.value) {
    throw new Error("Authentication token not found");
  }

  const params = new URLSearchParams({
    limit: limit.toString(),
  });

  if (lastKey) {
    params.append("last_key", lastKey);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/submissions/history?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      credentials: "include",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      return { history: [], pagination: { hasMore: false, lastKey: null } };
    }

    throw new Error(`Failed to fetch history: ${response.status}`);
  }

  const data = await response.json();

  return {
    history: data.data?.submissions || [],
    pagination: {
      hasMore: !!data.data?.next_key,
      lastKey: data.data?.next_key || null,
    },
  };
};

/**
 * Enrich with quest data
 */
const enrichWithQuestData = async (submissions) => {
  if (!submissions || submissions.length === 0) {
    return [];
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    if (!token?.value) {
      return submissions;
    }

    const questIds = [...new Set(submissions.map((sub) => sub.quest_id))];

    const questPromises = questIds.map(async (questId) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/quests/${questId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.value}`,
            },
            credentials: "include",
            cache: "force-cache",
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
    return submissions;
  }
};

const HistoryPage = async () => {
  // Fetch initial history data
  const historyData = await fetchHistorySubmissions(10);

  // Enrich with quest data
  const enrichedHistory = await enrichWithQuestData(historyData.history);

  return (
    <Suspense>
      <LoadMoreHistory
        initialHistory={enrichedHistory}
        initialLastKey={historyData.pagination.lastKey}
        initialHasMore={historyData.pagination.hasMore}
      />
    </Suspense>
  );
};

export default HistoryPage;
