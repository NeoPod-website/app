"use client";

import React from "react";

import QuestTask from "./QuestTask";

import QuestXTask from "./social/QuestXTask";
import QuestDiscordTask from "./social/QuestDiscordTask";
import QuestTelegramTask from "./social/QuestTelegramTask";

import XIcon from "@/components/ui/socialIcons/XIcon";
import DiscordIcon from "@/components/ui/socialIcons/DiscordIcon";
import TelegramIcon from "@/components/ui/socialIcons/TelegramIcon";

// Static social platform configurations (only UI-related data)
const socials = [
  {
    name: "x",
    icon: <XIcon className="h-3 w-3" />,
    color: "#000",
  },
  {
    name: "discord",
    icon: <DiscordIcon className="h-3 w-3" />,
    color: "#5865F2",
  },
  {
    name: "telegram",
    icon: <TelegramIcon className="h-3 w-3" />,
    color: "#0088cc",
  },
];

// Map task types to user-friendly headings
const getTaskHeading = (platform, taskType, task) => {
  // Use instruction as heading if available, otherwise use default heading
  if (task?.instruction) {
    return task.instruction;
  }

  if (platform === "x") {
    switch (taskType) {
      case "tweet":
        return "Create Tweet";
      case "follow":
        return `Follow @${task?.username || "User"}`;
      case "react":
        return "Interact with Tweet";
      case "spaces":
        return "Join Twitter Space";
      default:
        return "Twitter Task";
    }
  }

  if (platform === "discord") {
    return "Discord Task";
  }

  if (platform === "telegram") {
    return "Telegram Task";
  }

  return "Social Task";
};

const QuestSocialTask = ({
  name = "x",
  type,
  task,
  xUser,
  questId,
  discordUser,
  telegramUser,
}) => {
  // Find the social platform configuration
  const selectedSocial =
    socials.find(
      (social) => social.name.toLowerCase() === name.toLowerCase(),
    ) || socials[0]; // Default to X if not found

  // Determine task type from backend data if not provided
  const taskType = type || task?.twitterTaskType || "tweet";

  // Get dynamic heading based on platform, task type and task data
  const heading = getTaskHeading(name, taskType, task);

  // console.log("QuestSocialTask - selectedSocial:", selectedSocial);
  // console.log("QuestSocialTask - taskType:", taskType);
  // console.log("QuestSocialTask - task:", task);

  return (
    <QuestTask
      isAdmin={false}
      heading={heading}
      icon={selectedSocial.icon}
      color={selectedSocial.color}
      description={task?.description}
      text={selectedSocial.name.toUpperCase()}
    >
      {selectedSocial.name === "x" && (
        <QuestXTask
          task={task}
          xUser={xUser}
          questId={questId}
          taskType={taskType}
        />
      )}

      {selectedSocial.name === "telegram" && (
        <QuestTelegramTask
          task={task}
          questId={questId}
          telegramUser={telegramUser}
        />
      )}

      {selectedSocial.name === "discord" && (
        <QuestDiscordTask
          task={task}
          questId={questId}
          discordUser={discordUser}
        />
      )}
    </QuestTask>
  );
};

export default QuestSocialTask;
