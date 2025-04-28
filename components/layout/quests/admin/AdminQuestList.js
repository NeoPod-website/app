import React from "react";

import AdminQuestListClient from "./AdminQuestListClient";

const quests = [
  {
    id: 1,
    title: "Partners and Community Mixer",
    status: "live",
    recurrence: "monthly",
    cooldown: "never",
    position: 1,
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
    title: "Weekly Community Challenge",
    status: "draft",
    recurrence: "weekly",
    cooldown: "daily",
    position: 2,
    due_date: "5 days 10 hours",
    rewards: "500 XP Points",
    tasks: [
      {
        name: "text",
        heading: "Challenge Description",
        description: "Describe how you completed the challenge.",
      },
      {
        name: "file",
        heading: "Challenge Proof",
        description: "Upload proof of completion.",
      },
    ],
    points: 75,
  },
  {
    id: 3,
    title: "Daily Token Claim",
    status: "live",
    recurrence: "daily",
    cooldown: "12h",
    position: 3,
    due_date: "1 day 6 hours",
    rewards: "10 Tokens",
    tasks: [
      {
        name: "text",
        heading: "Claim Message",
        description: "Enter your claim message.",
      },
    ],
    points: 25,
  },
];

const AdminQuestList = ({
  categoryId,
  compact = false,
  scrollable = false,
}) => {
  return <AdminQuestListClient quests={quests} scrollable={scrollable} />;
};

export default AdminQuestList;
