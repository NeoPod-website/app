import { cookies } from "next/headers";
import React, { Suspense } from "react";

import WrapperContainer from "@/components/common/WrapperContainer";
import HighlightedSection from "@/components/layout/ambassadors/history/HighlightedSection";

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

const HighlightedPage = async () => {
  // Fetch initial highlighted data
  const highlightedData = await fetchHighlightedSubmissions(10);

  // Enrich with quest data
  const enrichedHighlighted = await enrichWithQuestData(
    highlightedData.highlighted,
  );

  return (
    <WrapperContainer
      scrollable
      className="hidden min-w-80 max-w-md flex-1 space-y-6 p-3 px-4 md:block md:p-4 lg:p-6 3xl:p-10"
    >
      <h2 className="font-work-sans text-3xl font-bold 3xl:text-4xl">
        Highlighted
      </h2>

      <Suspense>
        <HighlightedSection
          initialHighlighted={enrichedHighlighted}
          initialLastKey={highlightedData.pagination.lastKey}
          initialHasMore={highlightedData.pagination.hasMore}
        />
      </Suspense>
    </WrapperContainer>
  );
};

export default HighlightedPage;
