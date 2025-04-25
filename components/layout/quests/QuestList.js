import React from "react";

import QuestItem from "./QuestItem";

const quests = [
  {
    id: 1,
    title: "Partners and Community Mixer",
    recurrence: "Monthly",
    due_date: "2 days 23 hours",
    rewards: "1 Prestige NFT",
    tasks: ["text", "nft", "discord", "link"],
    points: 100,
  },
  {
    id: 2,
    title: "Partners and Community Mixer",
    recurrence: "Monthly",
    due_date: "2 days 23 hours",
    rewards: "1 Prestige NFT",
    tasks: ["file", "text", "number", "url", "twitter"],
    points: 500,
  },
  {
    id: 3,
    title: "Partners and Community Mixer",
    recurrence: "Monthly",
    due_date: "2 days 23 hours",
    rewards: "1 Prestige NFT",
    tasks: ["nft", "twitter", "telegram", "token"],
    points: 900,
  },
  {
    id: 4,
    title: "Partners and Community Mixer",
    recurrence: "Monthly",
    due_date: "2 days 23 hours",
    rewards: "1 Prestige NFT",
    tasks: ["file", "text", "url", "telegram"],
    points: 200,
  },
];

const QuestList = ({ categoryId }) => {
  return (
    <ul className="grid grid-cols-1 gap-8 p-8 md:grid-cols-2 lg:grid-cols-3">
      {quests.map((quest) => (
        <QuestItem
          key={quest.id}
          recurrence={quest.recurrence}
          title={quest.title}
          due_date={quest.due_date}
          rewards={quest.rewards}
          tasks={quest.tasks}
          points={quest.points}
        />
      ))}
    </ul>
  );
};

export default QuestList;
