// import React, { Suspense } from "react";

// import RejectedSubmissionsContainer from "@/components/layout/ambassadors/history/rejected/RejectedSubmissionsContainer";

// export const dynamic = "force-dynamic";

// export const metadata = {
//   title: "Rejected Submissions | NeoPod",
//   description: "Learn from rejected submissions and improve your future work.",
// };

// // Demo data for rejected submissions
// const DEMO_REJECTED_SUBMISSIONS = [
//   {
//     submission_id: "sub_001",
//     ambassador_id: "amb_123",
//     submitted_at: "2025-01-16T23:30:00Z",
//     review_status: "rejected",
//     reviewed_by: "admin_001",
//     review_comment:
//       "Content does not meet quality standards. Please ensure your tweet includes proper hashtags and mentions the NeoPod program clearly. The engagement metrics are below the minimum threshold required.",
//     is_flagged: "false",
//     resubmission_count: 1,
//     quest_name: "Share a Tweet on NeoPod Ambassador Program",
//   },
//   {
//     submission_id: "sub_002",
//     ambassador_id: "amb_456",
//     submitted_at: "2025-01-15T11:45:00Z",
//     review_status: "rejected",
//     reviewed_by: "admin_002",
//     review_comment:
//       "Missing required hashtags and the engagement metrics are below the minimum threshold. Please resubmit with proper formatting and ensure all guidelines are followed.",
//     is_flagged: "false",
//     resubmission_count: 0,
//     quest_name: "Create Instagram Story for NEO Community",
//   },
//   {
//     submission_id: "sub_007",
//     ambassador_id: "amb_111",
//     submitted_at: "2025-01-14T08:00:00Z",
//     review_status: "rejected",
//     reviewed_by: "admin_001",
//     review_comment:
//       "The content lacks depth and doesn't adequately explain the technical concepts. Please provide more detailed explanations, add practical examples, and improve the overall structure.",
//     is_flagged: "false",
//     resubmission_count: 2,
//     quest_name: "Create Tutorial on NEO Smart Contracts",
//   },
//   {
//     submission_id: "sub_011",
//     ambassador_id: "amb_333",
//     submitted_at: "2025-01-13T14:20:00Z",
//     review_status: "rejected",
//     reviewed_by: "admin_003",
//     review_comment:
//       "The video quality is poor and audio is unclear. Please re-record with better equipment and ensure all talking points from the brief are covered comprehensively.",
//     is_flagged: "false",
//     resubmission_count: 1,
//     quest_name: "Record Educational Video about DeFi",
//   },
//   {
//     submission_id: "sub_014",
//     ambassador_id: "amb_444",
//     submitted_at: "2025-01-12T16:30:00Z",
//     review_status: "rejected",
//     reviewed_by: "admin_002",
//     review_comment:
//       "The infographic design doesn't follow brand guidelines and contains factual errors. Please review the style guide and verify all information before resubmitting.",
//     is_flagged: "false",
//     resubmission_count: 0,
//     quest_name: "Design NEO Brand Infographic",
//   },
//   {
//     submission_id: "sub_017",
//     ambassador_id: "amb_555",
//     submitted_at: "2025-01-11T09:15:00Z",
//     review_status: "rejected",
//     reviewed_by: "admin_001",
//     review_comment:
//       "The article lacks proper research citations and contains outdated information. Please use current data and provide credible sources for all claims made.",
//     is_flagged: "false",
//     resubmission_count: 1,
//     quest_name: "Write Research Article on Blockchain Trends",
//   },
// ];

// async function fetchRejectedSubmissions() {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 600));

//   // Calculate stats from actual data
//   const thisMonth = DEMO_REJECTED_SUBMISSIONS.filter((s) => {
//     const now = new Date();
//     const submittedDate = new Date(s.submitted_at);

//     return (
//       submittedDate.getMonth() === now.getMonth() &&
//       submittedDate.getFullYear() === now.getFullYear()
//     );
//   }).length;

//   return {
//     submissions: DEMO_REJECTED_SUBMISSIONS,
//     pagination: {
//       hasMore: true,
//       lastEvaluatedKey: { submission_id: "sub_017" },
//     },
//     stats: {
//       currentCount: DEMO_REJECTED_SUBMISSIONS.length,
//       thisMonth: thisMonth,
//       hasMore: true,
//     },
//   };
// }

// const RejectedSubmissionsPage = async () => {
//   const initialData = await fetchRejectedSubmissions();

//   return (
//     <Suspense>
//       <RejectedSubmissionsContainer
//         initialStats={initialData.stats}
//         initialSubmissions={initialData.submissions}
//         initialHasMore={initialData.pagination.hasMore}
//         initialLastKey={initialData.pagination.lastEvaluatedKey}
//       />
//     </Suspense>
//   );
// };

// export default RejectedSubmissionsPage;

import { cookies } from "next/headers";
import React, { Suspense } from "react";

import RejectedSubmissionsContainer from "@/components/layout/ambassadors/history/rejected/RejectedSubmissionsContainer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Rejected Submissions | NeoPod",
  description: "Learn from rejected submissions and improve your future work.",
};

const fetchRejectedSubmissions = async (limit = 10, lastKey = null) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  if (!token?.value) {
    throw new Error("Authentication token not found");
  }

  const params = new URLSearchParams({
    status: "rejected",
    limit: limit.toString(),
  });

  if (lastKey) {
    params.append("last_key", lastKey);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/submissions/rejected?${params.toString()}`,
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
      return { rejected: [], pagination: { hasMore: false, lastKey: null } };
    }

    throw new Error(`Failed to fetch rejected submissions: ${response.status}`);
  }

  const data = await response.json();

  return {
    rejected: data.data?.submissions || [],
    pagination: {
      hasMore: !!data.data?.next_key,
      lastKey: data.data?.next_key || null,
    },
  };
};

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
    console.error("Error enriching with quest data:", error);
    return submissions;
  }
};

const RejectedSubmissionsPage = async () => {
  // Fetch initial rejected submissions
  const rejectedData = await fetchRejectedSubmissions(10);

  // Enrich with quest data
  const enrichedRejected = await enrichWithQuestData(rejectedData.rejected);

  // Calculate stats from actual data
  const thisMonth = enrichedRejected.filter((s) => {
    const submittedDate = new Date(s.submitted_at);
    const now = new Date();
    return (
      submittedDate.getMonth() === now.getMonth() &&
      submittedDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const initialData = {
    submissions: enrichedRejected,
    pagination: rejectedData.pagination,
    stats: {
      currentCount: enrichedRejected.length,
      thisMonth: thisMonth,
      hasMore: rejectedData.pagination.hasMore,
    },
  };

  return (
    <Suspense>
      <RejectedSubmissionsContainer
        initialStats={initialData.stats}
        initialSubmissions={initialData.submissions}
        initialHasMore={initialData.pagination.hasMore}
        initialLastKey={initialData.pagination.lastKey}
      />
    </Suspense>
  );
};

export default RejectedSubmissionsPage;
