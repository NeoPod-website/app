import React from "react";
import { cookies } from "next/headers";

import { getCachedSession } from "@/lib/userSession";

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

const checkQuestSubmissionStatus = async (questId) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    if (!token?.value) {
      return null;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/submissions/filter-for-quests`,
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
      console.error("Failed to fetch submission status:", response.status);
      return null;
    }

    const data = await response.json();
    const submissions = data.data?.submissions?.[questId] || [];

    // Return the most recent submission (sorted by submitted_at descending)
    if (submissions.length > 0) {
      return submissions.sort(
        (a, b) => new Date(b.submitted_at) - new Date(a.submitted_at),
      )[0];
    }

    return null;
  } catch (error) {
    console.error("Error checking quest submission status:", error);
    return null;
  }
};

const QuestDetails = async ({ quest }) => {
  const { user } = await getCachedSession();

  // Check if user has already submitted this quest
  const existingSubmission = await checkQuestSubmissionStatus(
    quest.quest_id,
    user.ambassador_id,
  );

  // If quest is submitted and not rejected, show submission status
  const showSubmissionStatus =
    existingSubmission && existingSubmission.review_status !== "rejected";

  return (
    <WrapperContainer scrollable className="max-w-4.5xl flex-[2] p-10">
      <div className="hide-scroll flex-1 space-y-9 overflow-y-auto">
        <QuestDetailHeading
          title={quest.name}
          cooldown={quest.cooldown}
          due_date={quest.due_date}
          claim_limit={quest.limit}
          recurrence={quest.recurrence}
        />

        <QuestDetailReward rewards={quest.rewards} />

        {showSubmissionStatus ? (
          <QuestSubmittedStatus submission={existingSubmission} quest={quest} />
        ) : (
          <>
            <QuestDetailDescription description={quest.description} />
            <QuestDetailsTask quest={quest} user={user} />
          </>
        )}
      </div>

      <div className="mt-3 flex justify-between">
        <ShareQuestBtn quest={quest} />

        <div className="flex gap-4">
          <HighlightsQuestBtn />

          {!showSubmissionStatus && (
            <SubmitQuestBtn
              podId={quest.pod_id}
              questId={quest.quest_id}
              categoryId={quest.category_id}
              ambassadorId={user.ambassador_id}
            />
          )}

          <QuestSubmittedBtn
            quest={quest}
            submission={existingSubmission}
            showSubmissionStatus={showSubmissionStatus}
          />
        </div>
      </div>
    </WrapperContainer>
  );
};

export default QuestDetails;
