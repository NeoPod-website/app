// import HighlightedSubmissionsContainer from "@/components/layout/ambassadors/history/highlighted/HighlightedSubmissionsContainer";
// import React, { Suspense } from "react";

// export const dynamic = "force-dynamic";

// export const metadata = {
//   title: "Highlighted Submissions | NeoPod",
//   description:
//     "Your outstanding work that has been recognized for exceptional quality.",
// };

// // Demo data for highlighted submissions
// const DEMO_HIGHLIGHTED_SUBMISSIONS = [
//   {
//     submission_id: "sub_009",
//     ambassador_id: "amb_789",
//     submitted_at: "2025-01-18T16:20:00Z",
//     review_status: "highlighted",
//     reviewed_by: "admin_001",
//     review_comment:
//       "Outstanding work! This submission goes above and beyond expectations. The creativity, technical accuracy, and presentation quality are exceptional. This will be featured in our community showcase as an example of excellence.",
//     is_flagged: "false",
//     resubmission_count: 0,
//     quest_name: "Create Interactive NEO Blockchain Demo",
//   },
//   {
//     submission_id: "sub_013",
//     ambassador_id: "amb_445",
//     submitted_at: "2025-01-17T09:15:00Z",
//     review_status: "highlighted",
//     reviewed_by: "admin_002",
//     review_comment:
//       "Incredible content! This video tutorial is comprehensive, well-structured, and professionally produced. The explanations are clear and the examples are perfect. This will definitely help many developers in our community.",
//     is_flagged: "false",
//     resubmission_count: 0,
//     quest_name: "Advanced Smart Contract Tutorial Series",
//   },
//   {
//     submission_id: "sub_016",
//     ambassador_id: "amb_667",
//     submitted_at: "2025-01-16T14:30:00Z",
//     review_status: "highlighted",
//     reviewed_by: "admin_003",
//     review_comment:
//       "Phenomenal research and analysis! The depth of insight and the quality of data presentation is remarkable. This research paper will be valuable for the entire NEO ecosystem. Truly exceptional work!",
//     is_flagged: "false",
//     resubmission_count: 0,
//     quest_name: "NEO Ecosystem Market Analysis Report",
//   },
//   {
//     submission_id: "sub_019",
//     ambassador_id: "amb_889",
//     submitted_at: "2025-01-15T11:45:00Z",
//     review_status: "highlighted",
//     reviewed_by: "admin_001",
//     review_comment:
//       "Amazing community engagement! Your discussion post generated over 200 meaningful comments and helped several developers solve complex problems. The way you facilitated the conversation was masterful.",
//     is_flagged: "false",
//     resubmission_count: 0,
//     quest_name: "Lead Technical Discussion on Gas Optimization",
//   },
// ];

// async function fetchHighlightedSubmissions() {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 600));

//   // Calculate stats from actual data
//   const thisMonth = DEMO_HIGHLIGHTED_SUBMISSIONS.filter((s) => {
//     const submittedDate = new Date(s.submitted_at);
//     const now = new Date();
//     return (
//       submittedDate.getMonth() === now.getMonth() &&
//       submittedDate.getFullYear() === now.getFullYear()
//     );
//   }).length;

//   return {
//     submissions: DEMO_HIGHLIGHTED_SUBMISSIONS,
//     pagination: {
//       hasMore: true,
//       lastEvaluatedKey: { submission_id: "sub_019" },
//     },
//     stats: {
//       currentCount: DEMO_HIGHLIGHTED_SUBMISSIONS.length,
//       thisMonth: thisMonth,
//       hasMore: true,
//     },
//   };
// }

// const HighlightedSubmissionsPage = async () => {
//   const initialData = await fetchHighlightedSubmissions();

//   return (
//     <Suspense>
//       <HighlightedSubmissionsContainer
//         initialStats={initialData.stats}
//         initialSubmissions={initialData.submissions}
//         initialHasMore={initialData.pagination.hasMore}
//         initialLastKey={initialData.pagination.lastEvaluatedKey}
//       />
//     </Suspense>
//   );
// };

// export default HighlightedSubmissionsPage;

import { cookies } from "next/headers";
import React, { Suspense } from "react";

import HighlightedSubmissionsContainer from "@/components/layout/ambassadors/history/highlighted/HighlightedSubmissionsContainer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Highlighted Submissions | NeoPod",
  description:
    "Your outstanding work that has been recognized for exceptional quality.",
};

const fetchHighlightedSubmissions = async (limit = 10, lastKey = null) => {
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
    `${process.env.NEXT_PUBLIC_API_URL}/submissions/highlighted?${params.toString()}`,
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
      return { highlighted: [], pagination: { hasMore: false, lastKey: null } };
    }

    throw new Error(`Failed to fetch highlighted: ${response.status}`);
  }

  const data = await response.json();

  return {
    highlighted: data.data?.submissions || [],
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
    return submissions;
  }
};

const HighlightedSubmissionsPage = async () => {
  // Fetch initial highlighted data
  const highlightedData = await fetchHighlightedSubmissions(10);

  // Enrich with quest data
  const enrichedHighlighted = await enrichWithQuestData(
    highlightedData.highlighted,
  );

  // Calculate stats from actual data
  const thisMonth = enrichedHighlighted.filter((s) => {
    const submittedDate = new Date(s.submitted_at);
    const now = new Date();
    return (
      submittedDate.getMonth() === now.getMonth() &&
      submittedDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const initialData = {
    submissions: enrichedHighlighted,
    pagination: highlightedData.pagination,
    stats: {
      currentCount: enrichedHighlighted.length,
      thisMonth: thisMonth,
      hasMore: highlightedData.pagination.hasMore,
    },
  };

  return (
    <Suspense>
      <HighlightedSubmissionsContainer
        initialStats={initialData.stats}
        initialSubmissions={initialData.submissions}
        initialHasMore={initialData.pagination.hasMore}
        initialLastKey={initialData.pagination.lastKey}
      />
    </Suspense>
  );
};

export default HighlightedSubmissionsPage;
