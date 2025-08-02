import React from "react";
import { cookies } from "next/headers";

import { getCachedSession } from "@/lib/userSession";
import { checkQuestAvailabilityWithTiming } from "@/utils/questAvailabilityFilter";

import QuestDetailsTask from "./QuestDetailTask";
import QuestDetailReward from "./QuestDetailReward";
import QuestDetailHeading from "./QuestDetailHeading";
import QuestSubmittedStatus from "./QuestSubmittedStatus";
import QuestDetailDescription from "./QuestDetailDescription";

import WrapperContainer from "@/components/common/WrapperContainer";

import ShareQuestBtn from "@/components/ui/buttons/quest/ShareQuestBtn";
import SubmitQuestBtn from "@/components/ui/buttons/quest/SubmitQuestBtn";
import QuestSubmittedBtn from "@/components/ui/buttons/quest/QuestSubmittedBtn";
import HighlightsQuestBtn from "@/components/ui/buttons/quest/HighlightsQuestBtn";

const fetchQuestSubmissions = async (questId) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    if (!token?.value) {
      return [];
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/submissions/filter-for-quests?limit=100`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        credentials: "include",
        body: JSON.stringify({ questIds: [questId] }),
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch quest submissions:", response.status);
      return [];
    }

    const data = await response.json();
    return data.data?.submissions?.[questId] || [];
  } catch (error) {
    console.error("Error fetching quest submissions:", error);
    return [];
  }
};

const fetchRequiredQuestSubmissions = async (requiredQuestIds) => {
  try {
    if (!requiredQuestIds || requiredQuestIds.length === 0) {
      return {};
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    if (!token?.value) {
      return {};
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/submissions/filter-for-quests?limit=100`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        credentials: "include",
        body: JSON.stringify({ questIds: requiredQuestIds }),
      },
    );

    if (!response.ok) {
      console.error(
        "Failed to fetch required quest submissions:",
        response.status,
      );
      return {};
    }

    const data = await response.json();
    return data.data?.submissions || {};
  } catch (error) {
    console.error("Error fetching required quest submissions:", error);
    return {};
  }
};

// Get completed quest IDs from submissions (same logic as CategoryContainer)
const getCompletedQuestIds = (userSubmissions) => {
  const completedQuests = [];

  Object.entries(userSubmissions).forEach(([questId, submissions]) => {
    if (Array.isArray(submissions)) {
      const hasApprovedSubmission = submissions.some(
        (sub) => sub.review_status === "approved",
      );
      if (hasApprovedSubmission) {
        completedQuests.push(questId);
      }
    }
  });

  return completedQuests;
};

const QuestDetails = async ({ quest }) => {
  const { user } = await getCachedSession();

  // Fetch submissions for this specific quest
  const questSubmissions = await fetchQuestSubmissions(quest.quest_id);

  // Only fetch required quest submissions if this quest has requirements
  let completedQuests = [];
  if (quest.requirements && quest.requirements.length > 0) {
    const requiredQuestIds = quest.requirements
      .filter((req) => req.type === "quest_completion")
      .map((req) => req.quest_id);

    if (requiredQuestIds.length > 0) {
      const requiredQuestSubmissions =
        await fetchRequiredQuestSubmissions(requiredQuestIds);
      completedQuests = getCompletedQuestIds(requiredQuestSubmissions);
    }
  }

  // Use the same availability logic as quest list
  const availabilityResult = checkQuestAvailabilityWithTiming(
    quest,
    questSubmissions,
    user,
    completedQuests,
  );

  // Get the most recent submission for display
  const mostRecentSubmission =
    questSubmissions.length > 0
      ? questSubmissions.sort(
          (a, b) => new Date(b.submitted_at) - new Date(a.submitted_at),
        )[0]
      : null;

  // Determine what to show based on availability
  const shouldShowSubmissionForm = availabilityResult.available;

  // Show submission status if:
  // 1. There's a pending/in-progress submission, OR
  // 2. Quest is not available due to completion/cooldown/recurrence (but user has submitted before)
  const shouldShowSubmissionStatus =
    mostRecentSubmission &&
    // Has pending submission
    (["pending", "in_progress"].includes(mostRecentSubmission.review_status) ||
      // Quest is not available due to completion/cooldown/recurrence
      (!availabilityResult.available &&
        [
          "Quest already completed (one-time)",
          "Quest in cooldown period",
        ].includes(availabilityResult.reason)) ||
      availabilityResult.reason.includes("Already submitted this"));

  return (
    <WrapperContainer scrollable className="max-w-4.5xl flex-[2] p-6 3xl:p-10">
      <div className="hide-scroll flex-1 space-y-6 overflow-y-auto 3xl:space-y-9">
        <QuestDetailHeading
          title={quest.name}
          cooldown={quest.cooldown}
          due_date={quest.due_date}
          claim_limit={quest.limit}
          recurrence={quest.recurrence}
        />

        <QuestDetailReward rewards={quest.rewards} />

        {!availabilityResult.available && !shouldShowSubmissionStatus && (
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-2 xl:p-4">
            <div className="flex items-start gap-2">
              <div className="mt-px text-yellow-400">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div>
                <p className="mb-1 text-sm font-bold text-yellow-400">
                  Quest Not Available
                </p>

                <p className="text-xs text-yellow-300">
                  {availabilityResult.reason}
                </p>

                {availabilityResult.nextAvailableDate && (
                  <p className="text-xs text-yellow-300">
                    Available again:{" "}
                    {availabilityResult.nextAvailableDate.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {shouldShowSubmissionStatus ? (
          <QuestSubmittedStatus
            quest={quest}
            submission={mostRecentSubmission}
          />
        ) : (
          <>
            <QuestDetailDescription description={quest.description} />
            <QuestDetailsTask quest={quest} user={user} />
          </>
        )}
      </div>

      <div className="mt-3 flex justify-between">
        <ShareQuestBtn quest={quest} />

        <div className="relative flex gap-2 xl:gap-4">
          <HighlightsQuestBtn />

          {shouldShowSubmissionForm && (
            <SubmitQuestBtn
              podId={quest.pod_id}
              questId={quest.quest_id}
              categoryId={quest.category_id}
              ambassadorId={user.ambassador_id}
            />
          )}

          <QuestSubmittedBtn
            quest={quest}
            submission={mostRecentSubmission}
            showSubmissionStatus={shouldShowSubmissionStatus}
          />
        </div>
      </div>
    </WrapperContainer>
  );
};

export default QuestDetails;
