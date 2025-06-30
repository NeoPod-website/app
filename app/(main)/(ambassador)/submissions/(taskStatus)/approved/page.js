// import React, { Suspense } from "react";

// import AcceptedSubmissionsContainer from "@/components/layout/ambassadors/history/accepted/AcceptedSubmissionsContainer";

// export const dynamic = "force-dynamic";

// export const metadata = {
//   title: "Accepted Submissions | NeoPod",
//   description: "View all your approved and successful submissions.",
// };

// // Demo data for accepted submissions
// const DEMO_ACCEPTED_SUBMISSIONS = [
//   {
//     submission_id: "sub_003",
//     ambassador_id: "amb_789",
//     submitted_at: "2025-01-17T14:15:00Z",
//     review_status: "approved",
//     reviewed_by: "admin_001",
//     review_comment:
//       "Excellent work! Your tweet generated great engagement and perfectly represents the NeoPod values. The content quality is outstanding and shows deep understanding of our mission.",
//     is_flagged: "false",
//     resubmission_count: 0,
//     quest_name: "Share a Tweet on NeoPod Ambassador Program",
//   },
//   {
//     submission_id: "sub_006",
//     ambassador_id: "amb_987",
//     submitted_at: "2025-01-15T13:45:00Z",
//     review_status: "approved",
//     reviewed_by: "admin_002",
//     review_comment:
//       "Fantastic community engagement! Your post sparked meaningful discussions and provided valuable insights to the community. The technical accuracy is impressive.",
//     is_flagged: "false",
//     resubmission_count: 0,
//     quest_name: "Host Community Discussion on NEO Features",
//   },
//   {
//     submission_id: "sub_008",
//     ambassador_id: "amb_222",
//     submitted_at: "2025-01-14T19:30:00Z",
//     review_status: "approved",
//     reviewed_by: "admin_003",
//     review_comment:
//       "Perfect execution! The infographic is visually appealing and contains accurate, up-to-date information about NEO's roadmap. Professional quality work.",
//     is_flagged: "false",
//     resubmission_count: 0,
//     quest_name: "Design Infographic for NEO Roadmap",
//   },
//   {
//     submission_id: "sub_012",
//     ambassador_id: "amb_445",
//     submitted_at: "2025-01-13T11:20:00Z",
//     review_status: "approved",
//     reviewed_by: "admin_001",
//     review_comment:
//       "Great tutorial! Clear explanations, good examples, and excellent production quality. This will be very helpful for new developers.",
//     is_flagged: "false",
//     resubmission_count: 1,
//     quest_name: "Create Video Tutorial on Smart Contracts",
//   },
//   {
//     submission_id: "sub_015",
//     ambassador_id: "amb_556",
//     submitted_at: "2025-01-12T16:45:00Z",
//     review_status: "approved",
//     reviewed_by: "admin_002",
//     review_comment:
//       "Well-researched article with comprehensive coverage of the topic. Good use of examples and clear writing style.",
//     is_flagged: "false",
//     resubmission_count: 0,
//     quest_name: "Write Blog Post about NEO Ecosystem",
//   },
// ];

// async function fetchAcceptedSubmissions() {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 600));

//   // Calculate stats from actual data
//   const thisMonth = DEMO_ACCEPTED_SUBMISSIONS.filter((s) => {
//     const submittedDate = new Date(s.submitted_at);
//     const now = new Date();
//     return (
//       submittedDate.getMonth() === now.getMonth() &&
//       submittedDate.getFullYear() === now.getFullYear()
//     );
//   }).length;

//   return {
//     submissions: DEMO_ACCEPTED_SUBMISSIONS,
//     pagination: {
//       hasMore: true,
//       lastEvaluatedKey: { submission_id: "sub_015" },
//     },
//     stats: {
//       currentCount: DEMO_ACCEPTED_SUBMISSIONS.length,
//       thisMonth: thisMonth,
//       hasMore: true,
//     },
//   };
// }

// const AcceptedSubmissionsPage = async () => {
//   const initialData = await fetchAcceptedSubmissions();

//   return (
//     <Suspense>
//       <AcceptedSubmissionsContainer
//         initialStats={initialData.stats}
//         initialSubmissions={initialData.submissions}
//         initialHasMore={initialData.pagination.hasMore}
//         initialLastKey={initialData.pagination.lastEvaluatedKey}
//       />
//     </Suspense>
//   );
// };

// export default AcceptedSubmissionsPage;

import { cookies } from "next/headers";
import React, { Suspense } from "react";

import AcceptedSubmissionsContainer from "@/components/layout/ambassadors/history/accepted/AcceptedSubmissionsContainer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Accepted Submissions | NeoPod",
  description: "View all your approved and successful submissions.",
};

const fetchAcceptedSubmissions = async (limit = 10, lastKey = null) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  if (!token?.value) {
    throw new Error("Authentication token not found");
  }

  const params = new URLSearchParams({
    status: "approved",
    limit: limit.toString(),
  });

  if (lastKey) {
    params.append("last_key", lastKey);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/submissions/approved?${params.toString()}`,
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
      return { accepted: [], pagination: { hasMore: false, lastKey: null } };
    }

    throw new Error(`Failed to fetch accepted submissions: ${response.status}`);
  }

  const data = await response.json();

  return {
    accepted: data.data?.submissions || [],
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

const AcceptedSubmissionsPage = async () => {
  // Fetch initial accepted submissions
  const acceptedData = await fetchAcceptedSubmissions(10);

  // Enrich with quest data
  const enrichedAccepted = await enrichWithQuestData(acceptedData.accepted);

  // Calculate stats from actual data
  const thisMonth = enrichedAccepted.filter((s) => {
    const submittedDate = new Date(s.submitted_at);
    const now = new Date();
    return (
      submittedDate.getMonth() === now.getMonth() &&
      submittedDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const initialData = {
    submissions: enrichedAccepted,
    pagination: acceptedData.pagination,
    stats: {
      currentCount: enrichedAccepted.length,
      thisMonth: thisMonth,
      hasMore: acceptedData.pagination.hasMore,
    },
  };

  return (
    <Suspense>
      <AcceptedSubmissionsContainer
        initialStats={initialData.stats}
        initialSubmissions={initialData.submissions}
        initialHasMore={initialData.pagination.hasMore}
        initialLastKey={initialData.pagination.lastKey}
      />
    </Suspense>
  );
};

export default AcceptedSubmissionsPage;
