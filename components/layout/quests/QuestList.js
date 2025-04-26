import React from "react";

import QuestItem from "./QuestItem";

const quests = [
  {
    id: 1,
    title: "Partners and Community Mixer",
    recurrence: "Monthly",
    due_date: "2 days 23 hours",
    rewards: "1 Prestige NFT",
    tasks: [
      {
        name: "url",
        heading: "Your Report Link",
        description:
          "The description of the report link. You can use any platform to create a report.",
      },
      {
        name: "file",
        heading: "Your NEO POD Design",
        description:
          "The description of the NEO POD design. You can use any platform to create a design.",
      },
      {
        name: "text",
        heading: "Your NEO POD Name",
        description:
          "The name of the NEO POD. You can use any platform to create a name.",
      },
      {
        name: "number",
        heading: "Your NEO POD ID",
        description:
          "The ID of the NEO POD. You can use any platform to create an ID.",
      },
    ],
    points: 100,
  },
  {
    id: 2,
    title: "Partners and Community Mixer",
    recurrence: "Monthly",
    due_date: "2 days 23 hours",
    rewards: "1 Prestige NFT",
    tasks: [
      {
        name: "file",
        heading: "Your File",
        description: "Please upload your file.",
      },
      {
        name: "text",
        heading: "Your Text Input",
        description: "Please provide your text input.",
      },
      {
        name: "number",
        heading: "Your Number Input",
        description: "Please provide your number input.",
      },
      {
        name: "url",
        heading: "Your URL",
        description: "Please provide your URL.",
      },
      {
        name: "twitter",
        heading: "Your Twitter Link",
        description: "Please provide a link to your tweet.",
      },
    ],
    points: 500,
  },
  {
    id: 3,
    title: "Partners and Community Mixer",
    recurrence: "Monthly",
    due_date: "2 days 23 hours",
    rewards: "1 Prestige NFT",
    tasks: [
      {
        name: "nft",
        heading: "Your NFT Address",
        description: "Please provide the address of your NFT.",
      },
      {
        name: "twitter",
        heading: "Your Twitter Link",
        description: "Please provide a link to your tweet.",
      },
      {
        name: "telegram",
        heading: "Your Telegram Handle",
        description: "Please provide your Telegram handle.",
      },
      {
        name: "token",
        heading: "Your Token ID",
        description: "Please provide the ID of your token.",
      },
    ],
    points: 900,
  },
  {
    id: 4,
    title: "Partners and Community Mixer",
    recurrence: "Monthly",
    due_date: "2 days 23 hours",
    rewards: "1 Prestige NFT",
    tasks: [
      {
        name: "file",
        heading: "Your File",
        description: "Please upload your file.",
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
    points: 200,
  },
  {
    id: 5,
    title: "Partners and Community Mixer",
    recurrence: "Monthly",
    due_date: "2 days 23 hours",
    rewards: "1 Prestige NFT",
    tasks: [
      {
        name: "file",
        heading: "Your File",
        description: "Please upload your file.",
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
    points: 200,
  },
  {
    id: 6,
    title: "Partners and Community Mixer",
    recurrence: "Monthly",
    due_date: "2 days 23 hours",
    rewards: "1 Prestige NFT",
    tasks: [
      {
        name: "file",
        heading: "Your File",
        description: "Please upload your file.",
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
    points: 200,
  },
  {
    id: 7,
    title: "Partners and Community Mixer",
    recurrence: "Monthly",
    due_date: "2 days 23 hours",
    rewards: "1 Prestige NFT",
    tasks: [
      {
        name: "file",
        heading: "Your File",
        description: "Please upload your file.",
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
    points: 200,
  },
];

const QuestList = ({ categoryId, compact = false, scrollable = false }) => {
  return (
    <ul
      className={`grid grid-cols-1 gap-8 p-8 ${compact ? "" : "md:grid-cols-2 lg:grid-cols-3"} ${scrollable ? "hide-scroll overflow-auto" : ""}`}
    >
      {quests.map((quest) => (
        <QuestItem
          key={quest.id}
          id={quest.id}
          title={quest.title}
          tasks={quest.tasks}
          points={quest.points}
          rewards={quest.rewards}
          due_date={quest.due_date}
          recurrence={quest.recurrence}
          categoryId={categoryId}
        />
      ))}
    </ul>
  );
};

export default QuestList;
