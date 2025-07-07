import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";

import LoadMoreSubmissions from "@/components/layout/submissions/LoadMoreSubmissions";

export const metadata = {
  title: "My Submissions | NeoPod",
  description:
    "View and manage your pending quest submissions awaiting review.",
};

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
  const submissionsData = await fetchMySubmissions(9);

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
