import React from "react";

import QuestMainTask from "../tasks/QuestMainTask";
import QuestVisitLink from "../tasks/QuestVisitLink";
import QuestSocialTask from "../tasks/QuestSocialTask";
import QuestNFTTask from "../tasks/onchain/QuestNFTTask";
import QuestTokenTask from "../tasks/onchain/QuestTokenTask";
import QuestFileUploadTask from "../tasks/QuestFileUploadTask";

import QuestDetailReward from "./QuestDetailReward";
import QuestDetailHeading from "./QuestDetailHeading";
import QuestDetailDescription from "./QuestDetailDescription";

import WrapperContainer from "@/components/common/WrapperContainer";

import ShareQuestBtn from "@/components/ui/buttons/quest/ShareQuestBtn";
import SubmitQuestBtn from "@/components/ui/buttons/quest/SubmitQuestBtn";
import HighlightsQuestBtn from "@/components/ui/buttons/quest/HighlightsQuestBtn";

const questDetails = {
  id: 1,
  title: "Partners and Community Mixer",
  description: `
    <h1>Partners and Community Mixer</h1>

    <p>Welcome to our <strong>monthly mixer</strong> where community members and partners come together to collaborate, share insights, and build strong connections.</p>

    <h2>Objectives</h2>
    <ul>
      <li>Meet fellow community members and project partners</li>
      <li>Showcase your recent contributions</li>
      <li>Explore collaboration opportunities</li>
    </ul>

    <h2>What You Need To Do</h2>
    <ol>
      <li>Fill out the <a href="" target="_blank">RSVP form</a></li>
      <li>Join the mixer event on Discord</li>
      <li>Submit proof of attendance and your ideas</li>
    </ol>

    <h2>Rewards</h2>
    <p>You can earn up to <strong>100 POD tokens</strong> and a unique <em>Community NFT</em> by attending and submitting your participation details.</p>

    <blockquote>
      “The strength of the community lies in collaboration.”
    </blockquote>

    <p>Let’s build together — see you at the event!</p>

    <blockquote>
      “The strength of the community lies in collaboration.”
    </blockquote>

    <p>Let’s build together — see you at the event!</p>

    <blockquote>
      “The strength of the community lies in collaboration.”
    </blockquote>

    <p>Let’s build together — see you at the event!</p>
  `,
  tasks: [
    {
      name: "file",
      heading: "Your File",
      description: "Please upload your file.",
      acceptedCategories: ["document", "image"],
    },
    {
      name: "text",
      heading: "Your Text Input",
      description: "Please provide your text input.",
    },
    {
      name: "url",
      heading: "Your URL",
      description: "Please provide your URL.",
    },
    {
      name: "telegram",
      heading: "Your Telegram Handle",
      description: "Please provide your Telegram handle.",
    },
  ],
  points: 100,
  rewards: [
    {
      name: "POD",
      quantity: 100,
    },
    {
      name: "NFT",
      quantity: 1,
    },
  ],
  due_date: "2 days 23 hours",
  recurrence: "Monthly",
  categoryId: 1,
  highlighted_quests: [
    {
      id: 3,
      title: "Partners and Community Mixer",
      recurrence: "Monthly",
      due_date: "2 days 23 hours",
      rewards: "1 Prestige NFT",
      tasks: ["file", "text", "url", "telegram"],
      points: 200,
    },
    {
      id: 7,
      title: "Partners and Community Mixer",
      recurrence: "Monthly",
      due_date: "2 days 23 hours",
      rewards: "1 Prestige NFT",
      tasks: ["file", "text", "url", "telegram"],
      points: 200,
    },
  ],
  claim_limit: 100,
  cooldown: "1 hour",
};

const QuestDetails = ({ questId }) => {
  return (
    <WrapperContainer scrollable className="max-w-4.5xl flex-[2] p-10">
      <div className="hide-scroll flex-1 space-y-9 overflow-y-auto">
        <QuestDetailHeading
          title={questDetails.title}
          cooldown={questDetails.cooldown}
          due_date={questDetails.due_date}
          recurrence={questDetails.recurrence}
          claim_limit={questDetails.claim_limit}
        />

        <QuestDetailReward rewards={questDetails.rewards} />

        <QuestDetailDescription description={questDetails.description} />

        <QuestMainTask
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
        <QuestTokenTask />
      </div>

      <div className="mt-3 flex justify-between">
        <ShareQuestBtn />

        <div className="flex gap-4">
          <HighlightsQuestBtn />
          <SubmitQuestBtn />
        </div>
      </div>
    </WrapperContainer>
  );
};

export default QuestDetails;
