import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { getCachedSession } from "@/lib/userSession";

import SubmissionEditMain from "@/components/layout/submissions/details/edit/SubmissionEditMain";
import SubmissionEditSidebar from "@/components/layout/submissions/details/edit/SubmissionEditSidebar";

async function fetchSubmissionForEdit(submissionId) {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  if (!token?.value) {
    throw new Error("Authentication token not found");
  }

  // Fetch the submission details
  const submissionResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      credentials: "include",
    },
  );

  if (!submissionResponse.ok) {
    if (submissionResponse.status === 404) {
      notFound();
    }
    throw new Error(`Failed to fetch submission: ${submissionResponse.status}`);
  }

  const submissionData = await submissionResponse.json();
  const submission = submissionData.data?.submission;

  if (!submission) {
    notFound();
  }

  // Check if submission can be edited (only pending submissions)
  if (submission.review_status !== "pending") {
    throw new Error(
      `Cannot edit submission with status: ${submission.review_status}. Only pending submissions can be edited.`,
    );
  }

  return submission;
}

// Function 2: Fetch quest and category details in parallel
// async function fetchQuestAndCategoryDetails(submission) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("neo-jwt");

//   if (!token?.value) {
//     throw new Error("Authentication token not found");
//   }

//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token.value}`,
//   };

//   // Fetch quest and category in parallel
//   const [questResponse, categoryResponse] = await Promise.all([
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}/quests/${submission.quest_id}`, {
//       method: "GET",
//       headers,
//       credentials: "include",
//     }),
//     fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/categories/${submission.category_id}`,
//       {
//         method: "GET",
//         headers,
//         credentials: "include",
//       },
//     ),
//   ]);

//   // Handle quest response
//   if (!questResponse.ok) {
//     return null;
//   }

//   // Handle category response
//   if (!categoryResponse.ok) {
//     return null;
//   }

//   // Parse responses in parallel
//   const [questData, categoryData] = await Promise.all([
//     questResponse.json(),
//     categoryResponse.json(),
//   ]);

//   const quest = questData.data?.quest;
//   const category = categoryData.data?.category;

//   return {
//     ...submission,
//     quest,
//     quest_name: quest?.name || "Unknown Quest",
//     category_name: category?.name || "Unknown Category",
//   };
// }

async function fetchQuestAndCategoryDetails(submission) {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  if (!token?.value) {
    throw new Error("Authentication token not found");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token.value}`,
  };

  // Fetch quest and category in parallel
  const [questResponse, categoryResponse] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/quests/${submission.quest_id}`, {
      method: "GET",
      headers,
      credentials: "include",
    }),
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/${submission.category_id}`,
      {
        method: "GET",
        headers,
        credentials: "include",
      },
    ),
  ]);

  // Handle quest response
  if (!questResponse.ok) {
    return null;
  }

  // Handle category response
  if (!categoryResponse.ok) {
    return null;
  }

  // Parse responses in parallel
  const [questData, categoryData] = await Promise.all([
    questResponse.json(),
    categoryResponse.json(),
  ]);

  const quest = questData.data?.quest;
  const category = categoryData.data?.category;

  // Use the SAME structure as the detail view
  const enrichedSubmission = {
    ...submission,

    // Quest information (flattened with quest_ prefix)
    quest_name: quest?.name || "Unknown Quest",
    quest_description: quest?.description || "",
    quest_tasks: quest?.tasks || [],
    quest_rewards: quest?.rewards || [],
    quest_points: quest?.points || 0,
    quest_cooldown: quest?.cooldown || "None",
    quest_recurrence: quest?.recurrence || "one-time",
    quest_due_date: quest?.due_date || null,
    quest_limit: quest?.limit || null,

    // Category information
    category_name: category?.name || quest?.category_name || "Unknown Category",
    category_description: category?.description || "",
    category_icon: category?.icon || null,
    category_background: category?.background || null,

    // Keep original data for reference (useful for edit main)
    original_quest_data: quest,
    original_category_data: category,
  };

  return enrichedSubmission;
}

const SubmissionEditPage = async ({ params }) => {
  const { submissionId } = await params;
  const { user } = await getCachedSession();

  const submission = await fetchSubmissionForEdit(submissionId);
  const enrichedSubmission = await fetchQuestAndCategoryDetails(submission);

  if (!enrichedSubmission) {
    notFound();
  }

  return (
    <div className="flex h-full flex-1 gap-4">
      <SubmissionEditMain submission={enrichedSubmission} user={user} />
      <SubmissionEditSidebar submission={enrichedSubmission} />
    </div>
  );
};

export default SubmissionEditPage;
