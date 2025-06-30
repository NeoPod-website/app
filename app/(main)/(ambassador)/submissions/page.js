// import { cookies } from "next/headers";
// import React, { Suspense } from "react";
// import { notFound } from "next/navigation";

// import LoadMoreSubmissions from "@/components/layout/ambassadors/submissions/LoadMoreSubmissions";

// export const dynamic = "force-dynamic";

// export const metadata = {
//   title: "My Submissions | NeoPod",
//   description:
//     "View and manage your pending quest submissions awaiting review.",
// };

// // Demo data for testing since backend is not ready
// const DEMO_SUBMISSIONS = [
//   {
//     submission_id: "sub_1",
//     quest_id: "quest_123",
//     quest_name: "Complete Twitter Engagement Challenge",
//     submitted_at: "2025-01-19T10:30:00Z",
//     category_name: "Social Media",
//     pod_name: "Content Creators",
//     review_status: "pending",
//     submission_data: {
//       task_1:
//         "Check out this amazing NEO ecosystem! The future of blockchain is here 🚀 #NEO #Blockchain #Web3",
//       task_2: "https://twitter.com/user/status/123456789",
//       task_3: true,
//     },
//     quest_tasks: [
//       { id: "task_1", name: "text", instruction: "Write a tweet about NEO" },
//       { id: "task_2", name: "url", instruction: "Share your tweet URL" },
//       { id: "task_3", name: "x", instruction: "Follow @NEO_Blockchain" },
//     ],
//   },
//   {
//     submission_id: "sub_2",
//     quest_id: "quest_456",
//     quest_name: "Upload Portfolio Documentation",
//     submitted_at: "2025-01-18T15:45:00Z",
//     category_name: "Development",
//     pod_name: "Developers Hub",
//     review_status: "pending",
//     submission_data: {
//       task_1: {
//         fileName: "portfolio.pdf",
//         fileSize: 2548000,
//         fileType: "application/pdf",
//         fileUrl: "https://example.com/files/portfolio.pdf",
//         uploaded: true,
//         category: "Document",
//       },
//       task_2: 5,
//     },
//     quest_tasks: [
//       {
//         id: "task_1",
//         name: "file-upload",
//         instruction: "Upload your portfolio",
//       },
//       { id: "task_2", name: "number", instruction: "Years of experience" },
//     ],
//   },
//   {
//     submission_id: "sub_3",
//     quest_id: "quest_789",
//     quest_name: "Join Community Channels",
//     submitted_at: "2025-01-17T09:15:00Z",
//     category_name: "Community",
//     pod_name: "Ambassadors",
//     review_status: "pending",
//     submission_data: {
//       task_1: { joined: true, verified: true },
//       task_2: { joined: true, verified: false },
//       task_3: "https://neopod.org/learn-more",
//     },
//     quest_tasks: [
//       { id: "task_1", name: "discord", instruction: "Join NEO Discord" },
//       { id: "task_2", name: "telegram", instruction: "Join NEO Telegram" },
//       { id: "task_3", name: "url", instruction: "Visit NEO website" },
//     ],
//   },
//   {
//     submission_id: "sub_4",
//     quest_id: "quest_101",
//     quest_name: "Write Technical Article",
//     submitted_at: "2025-01-16T14:20:00Z",
//     category_name: "Content Creation",
//     pod_name: "Writers Guild",
//     review_status: "pending",
//     submission_data: {
//       task_1:
//         "Understanding Smart Contracts in NEO: A Comprehensive Guide for Developers...",
//       task_2: 1250,
//       task_3: {
//         fileName: "article-cover.jpg",
//         fileSize: 856000,
//         fileType: "image/jpeg",
//         fileUrl: "https://example.com/images/cover.jpg",
//         uploaded: true,
//         category: "Image",
//       },
//     },
//     quest_tasks: [
//       { id: "task_1", name: "text", instruction: "Write article content" },
//       { id: "task_2", name: "number", instruction: "Word count" },
//       { id: "task_3", name: "file-upload", instruction: "Upload cover image" },
//     ],
//   },
//   {
//     submission_id: "sub_5",
//     quest_id: "quest_202",
//     quest_name: "NFT Collection Analysis",
//     submitted_at: "2025-01-15T11:30:00Z",
//     category_name: "Research",
//     pod_name: "Analytics Team",
//     review_status: "pending",
//     submission_data: {
//       task_1: "https://docs.google.com/document/d/analysis-report-123",
//       task_2: 25,
//       task_3:
//         "The NFT market shows significant growth in utility-based collections...",
//     },
//     quest_tasks: [
//       { id: "task_1", name: "url", instruction: "Submit analysis document" },
//       { id: "task_2", name: "number", instruction: "Collections analyzed" },
//       { id: "task_3", name: "text", instruction: "Key findings summary" },
//     ],
//   },
//   {
//     submission_id: "sub_6",
//     quest_id: "quest_303",
//     quest_name: "Video Tutorial Creation",
//     submitted_at: "2025-01-14T16:45:00Z",
//     category_name: "Education",
//     pod_name: "Educators",
//     review_status: "pending",
//     submission_data: {
//       task_1: {
//         fileName: "neo-tutorial.mp4",
//         fileSize: 45800000,
//         fileType: "video/mp4",
//         fileUrl: "https://example.com/videos/tutorial.mp4",
//         uploaded: true,
//         category: "Video",
//       },
//       task_2: "https://youtube.com/watch?v=demo123",
//       task_3: 15,
//     },
//     quest_tasks: [
//       {
//         id: "task_1",
//         name: "file-upload",
//         instruction: "Upload tutorial video",
//       },
//       { id: "task_2", name: "url", instruction: "YouTube link" },
//       { id: "task_3", name: "number", instruction: "Video duration (minutes)" },
//     ],
//   },
// ];

// const fetchSubmissions = async () => {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 800));

//   // Return demo data in expected format
//   return {
//     submissions: DEMO_SUBMISSIONS.slice(0, 3),
//     pagination: {
//       hasMore: true,
//       lastEvaluatedKey: { id: "sub_3" },
//     },
//   };
// };

// const SubmissionsPage = async () => {
//   const submissionsData = await fetchSubmissions();

//   return (
//     <Suspense>
//       <LoadMoreSubmissions
//         initialSubmissions={submissionsData.submissions || []}
//         initialLastKey={submissionsData.pagination?.lastEvaluatedKey}
//         initialHasMore={submissionsData.pagination?.hasMore || false}
//       />
//     </Suspense>
//   );
// };

// export default SubmissionsPage;

import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";

import LoadMoreSubmissions from "@/components/layout/ambassadors/submissions/LoadMoreSubmissions";

export const metadata = {
  title: "My Submissions | NeoPod",
  description:
    "View and manage your pending quest submissions awaiting review.",
};

/**
 * Fetch user's submissions from the backend
 * Only fetches submissions that are still under review (pending, in_progress)
 */
const fetchMySubmissions = async (limit = 9, lastKey = null) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  if (!token?.value) {
    throw new Error("Authentication token not found");
  }

  // Build query parameters
  const params = new URLSearchParams({
    limit: limit.toString(),
  });

  if (lastKey) {
    params.append("last_key", lastKey);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/submissions/pending?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      credentials: "include",
      cache: "no-store", // Always fetch fresh data for submissions
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }

    if (response.status === 403) {
      notFound();
    }

    throw new Error(`Failed to fetch submissions: ${response.status}`);
  }

  const data = await response.json();

  return {
    submissions: data.data?.submissions || [],
    pagination: {
      hasMore: !!data.data?.next_key,
      lastKey: data.data?.next_key || null,
    },
  };
};

/**
 * Fetch quest details for submissions to enrich the data
 * This adds quest names, categories, etc. to the submission data
 */
const enrichSubmissionsWithQuestData = async (submissions) => {
  if (!submissions || submissions.length === 0) {
    return [];
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    if (!token?.value) {
      return submissions; // Return as-is if no token
    }

    // Get unique quest IDs
    const questIds = [...new Set(submissions.map((sub) => sub.quest_id))];

    // Fetch quest details for all quests
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
            cache: "force-cache", // Cache quest data since it changes less frequently
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
        // Add quest information
        quest_name: questData?.name || "Unknown Quest",
        quest_description: questData?.description || "",
        quest_tasks: questData?.tasks || [],
        quest_rewards: questData?.rewards || [],
        category_name: questData?.category_name || "Unknown Category",
        pod_name: questData?.pod_name || "Unknown Pod",
        // Keep original data
        original_quest_data: questData,
      };
    });

    return enrichedSubmissions;
  } catch (error) {
    return submissions; // Return original submissions if enrichment fails
  }
};

const SubmissionsPage = async () => {
  // Fetch initial submissions (first page)
  const submissionsData = await fetchMySubmissions(9);

  // Enrich submissions with quest data
  const enrichedSubmissions = await enrichSubmissionsWithQuestData(
    submissionsData.submissions,
  );

  return (
    <Suspense>
      <LoadMoreSubmissions
        initialSubmissions={enrichedSubmissions}
        initialLastKey={submissionsData.pagination.lastKey}
        initialHasMore={submissionsData.pagination.hasMore}
      />
    </Suspense>
  );
};

export default SubmissionsPage;
