import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { getCachedSession } from "@/lib/userSession";

import SubmissionDetailMain from "@/components/layout/submissions/details/SubmissionDetailMain";
import SubmissionDetailSidebar from "@/components/layout/submissions/details/SubmissionDetailSidebar";

async function fetchSubmission(submissionId) {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}`,
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
      notFound();
    }

    if (response.status === 403) {
      notFound();
    }

    throw new Error(`Failed to fetch submission: ${response.status}`);
  }

  const data = await response.json();
  const submission = data.data?.submission;

  if (!submission) {
    throw new Error("No submission data in response");
  }

  return submission;
}

async function fetchQuestDetails(questId) {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  if (!token?.value) {
    return null;
  }

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

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const quest = data.data?.quest;

    return quest;
  } catch (error) {
    return null;
  }
}

async function fetchCategoryDetails(categoryId) {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  if (!token?.value) {
    return null;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`,
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

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const category = data.data?.category;

    return category;
  } catch (error) {
    return null;
  }
}

async function enrichSubmissionData(submission) {
  if (!submission) {
    return null;
  }

  // Fetch quest and category data in parallel
  const [questData, categoryData] = await Promise.all([
    fetchQuestDetails(submission.quest_id),
    submission.category_id
      ? fetchCategoryDetails(submission.category_id)
      : null,
  ]);

  // Create enriched submission object
  const enrichedSubmission = {
    ...submission,

    // Quest information
    quest_name: questData?.name || "Unknown Quest",
    quest_description: questData?.description || "",
    quest_tasks: questData?.tasks || [],
    quest_rewards: questData?.rewards || [],
    quest_points: questData?.points || 0,
    quest_cooldown: questData?.cooldown || "None",
    quest_recurrence: questData?.recurrence || "one-time",
    quest_due_date: questData?.due_date || null,
    quest_limit: questData?.limit || null,

    // Category information
    category_name:
      categoryData?.name || questData?.category_name || "Unknown Category",
    category_description: categoryData?.description || "",
    category_icon: categoryData?.icon || null,
    category_background: categoryData?.background || null,

    // Original data for reference
    original_quest_data: questData,
    original_category_data: categoryData,
  };

  return enrichedSubmission;
}

function validateSubmissionAccess(submission, user) {
  if (!submission || !user) {
    return false;
  }

  // User can access their own submissions
  if (
    submission.ambassador_id === user.ambassador_id ||
    submission.ambassador_id === user.id
  ) {
    return true;
  }

  // Admins can access any submission
  if (user.isAdmin) {
    return true;
  }

  return false;
}

const SubmissionViewPage = async ({ params }) => {
  const { submissionId } = await params;

  // Check authentication first
  const { user } = await getCachedSession();

  // Fetch the submission
  const submission = await fetchSubmission(submissionId);

  // Validate user has access to this submission
  if (!validateSubmissionAccess(submission, user)) {
    notFound();
  }

  // Enrich submission with quest and category data
  const enrichedSubmission = await enrichSubmissionData(submission);

  if (!enrichedSubmission) {
    notFound();
  }

  return (
    <div className="flex flex-1 gap-4 overflow-hidden">
      <SubmissionDetailMain submission={enrichedSubmission} user={user} />
      <SubmissionDetailSidebar submission={enrichedSubmission} user={user} />
    </div>
  );
};

export default SubmissionViewPage;
