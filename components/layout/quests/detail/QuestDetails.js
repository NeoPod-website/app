import React from "react";
import { getCachedSession } from "@/lib/userSession";

import QuestDetailsTask from "./QuestDetailTask";
import QuestDetailReward from "./QuestDetailReward";
import QuestDetailHeading from "./QuestDetailHeading";
import QuestDetailDescription from "./QuestDetailDescription";

import WrapperContainer from "@/components/common/WrapperContainer";

import ShareQuestBtn from "@/components/ui/buttons/quest/ShareQuestBtn";
import SubmitQuestBtn from "@/components/ui/buttons/quest/SubmitQuestBtn";
import HighlightsQuestBtn from "@/components/ui/buttons/quest/HighlightsQuestBtn";

const QuestDetails = async ({ quest }) => {
  const { user } = await getCachedSession();

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
        <QuestDetailDescription description={quest.description} />
        <QuestDetailsTask quest={quest} user={user} />
      </div>

      <div className="mt-3 flex justify-between">
        <ShareQuestBtn quest={quest} />

        <div className="flex gap-4">
          <HighlightsQuestBtn />
          <SubmitQuestBtn
            podId={quest.pod_id}
            questId={quest.quest_id}
            categoryId={quest.category_id}
            ambassadorId={user.ambassador_id}
          />
        </div>
      </div>
    </WrapperContainer>
  );
};

export default QuestDetails;
