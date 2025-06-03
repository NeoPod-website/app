"use client";

import React, { useMemo } from "react";
import { Input } from "@heroui/react";
import { LinkIcon, ArrowUp01Icon, LetterTextIcon } from "lucide-react";

import QuestTask from "./QuestTask";

const taskConfig = {
  url: {
    icon: <LinkIcon size={12} className="text-white" />,
    color: "#0670F7",
    label: "https://neopod.org",
    type: "url",
  },

  text: {
    icon: <LetterTextIcon size={12} className="text-white" />,
    color: "#ca8a04 ",
    label: "Your text goes here",
    type: "text",
  },

  number: {
    icon: <ArrowUp01Icon size={12} className="text-white" />,
    color: "#991b1b",
    label: "Your number goes here",
    type: "number",
  },
};

const QuestMainTask = ({ name, heading, description }) => {
  // Memoize the task configuration based on the 'name' prop
  const currentTaskConfig = useMemo(() => {
    return taskConfig[name];
  }, [name]);

  // If the provided 'name' doesn't exist in taskConfig, return null or a default
  if (!currentTaskConfig) {
    return null;
  }

  return (
    <QuestTask
      text={name}
      isAdmin={false}
      heading={heading}
      description={description}
      icon={currentTaskConfig.icon}
      color={currentTaskConfig.color}
    >
      <Input
        type={currentTaskConfig.type}
        size="lg"
        variant="bordered"
        placeholder={currentTaskConfig.label}
        className="bg-dark"
        classNames={{
          inputWrapper:
            "border-gray-300 focus-within:!border-gray-300 rounded-xl  focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black px-4 py-2.5",
        }}
      />
    </QuestTask>
  );
};

export default QuestMainTask;
