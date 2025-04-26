"use client";

import React from "react";

import QuestTask from "./QuestTask";

import QuestXTask from "./social/QuestXTask";
import QuestDiscordTask from "./social/QuestDiscordTask";
import QuestTelegramTask from "./social/QuestTelegramTask";

import XIcon from "@/components/ui/socialIcons/XIcon";
import DiscordIcon from "@/components/ui/socialIcons/DiscordIcon";
import TelegramIcon from "@/components/ui/socialIcons/TelegramIcon";

const socials = [
  {
    name: "telegram",
    color: "#24A1DE",
    heading: "Join Channel",
    label: "Join Telegram Channel",
    icon: <TelegramIcon className="h-3 w-3" />,
  },
  {
    name: "discord",
    color: "#7289DA",
    label: "Join Discord Server",
    heading: "Join Discord Server",
    icon: <DiscordIcon className="h-3 w-3" />,
  },
  {
    name: "x",
    icon: <XIcon className="h-3 w-3" />,
    label: "Tweet Now",
    heading: "Tweet URL",
    color: "#000",
    include: "#Hashtags,Hello,@mention,#crypto",
    type: "follow",
  },
  {
    name: "x",
    icon: <XIcon className="h-3 w-3" />,
    label: "Tweet Now",
    heading: "Tweet URL",
    color: "#000",
    include: "#Hashtags,Hello,@mention,#crypto",
    type: "tweet",
  },
  {
    name: "x",
    icon: <XIcon className="h-3 w-3" />,
    label: "Tweet Now",
    heading: "Tweet URL",
    color: "#000",
    include: "#Hashtags,Hello,@mention,#crypto",
    type: "react",
  },
  {
    name: "x",
    icon: <XIcon className="h-3 w-3" />,
    label: "Tweet Now",
    heading: "Tweet URL",
    color: "#000",
    include: "#Hashtags,Hello,@mention,#crypto",
    type: "spaces",
  },
];

const QuestSocialTask = ({ name = "x", type = "follow" }) => {
  // Find the selected social from the array based on prop name
  const selectedSocial =
    socials.find(
      (social) => social.name.toLowerCase() === name.toLowerCase(),
    ) || socials[2];

  return (
    <QuestTask
      icon={selectedSocial.icon}
      text={selectedSocial.name}
      heading={selectedSocial.heading}
      color={selectedSocial.color}
    >
      {selectedSocial.name === "x" && (
        <QuestXTask taskType={type} includeText={selectedSocial.include} />
      )}

      {selectedSocial.name === "telegram" && <QuestTelegramTask />}

      {selectedSocial.name === "discord" && <QuestDiscordTask />}
    </QuestTask>
  );
};

export default QuestSocialTask;
