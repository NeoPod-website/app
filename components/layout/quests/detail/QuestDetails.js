import React from "react";

import QuestDetailsTask from "./QuestDetailTask";
import QuestDetailReward from "./QuestDetailReward";
import QuestDetailHeading from "./QuestDetailHeading";
import QuestDetailDescription from "./QuestDetailDescription";

import WrapperContainer from "@/components/common/WrapperContainer";

import ShareQuestBtn from "@/components/ui/buttons/quest/ShareQuestBtn";
import SubmitQuestBtn from "@/components/ui/buttons/quest/SubmitQuestBtn";
import HighlightsQuestBtn from "@/components/ui/buttons/quest/HighlightsQuestBtn";

const QuestDetails = ({ quest }) => {
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

        {/* <QuestMainTask
          name="url"
          heading="Website Link"
          description="Enter the URL of your website."
        />
        <QuestMainTask
          name="text"
          heading="Your Feedback"
          description="Please provide your valuable feedback."
        />
        <QuestMainTask
          name="number"
          heading="Your ID"
          description="Enter your unique identification number."
        />
        <QuestFileUploadTask
          name="file"
          heading="Your File"
          description="Please upload your file."
        />
        <QuestVisitLink />
        <QuestSocialTask name="x" type="follow" />
        <QuestSocialTask name="x" type="tweet" />
        <QuestSocialTask name="x" type="react" />
        <QuestSocialTask name="x" type="spaces" />
        <QuestSocialTask name="telegram" type="join" />
        <QuestSocialTask name="discord" type="join" />
        <QuestNFTTask />
        <QuestTokenTask /> */}
        <QuestDetailsTask quest={quest} />
      </div>

      <div className="mt-3 flex justify-between">
        <ShareQuestBtn quest={quest} />

        <div className="flex gap-4">
          <HighlightsQuestBtn />
          <SubmitQuestBtn />
        </div>
      </div>
    </WrapperContainer>
  );
};

export default QuestDetails;
