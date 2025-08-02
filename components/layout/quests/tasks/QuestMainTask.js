"use client";

import React, { useMemo } from "react";
import { addToast, Input } from "@heroui/react";
import { useSelector, useDispatch } from "react-redux";
import { LinkIcon, ArrowUp01Icon, LetterTextIcon } from "lucide-react";

import QuestTask from "./QuestTask";

import {
  updateTaskAnswer,
  selectTaskAnswer,
} from "@/redux/slice/submissionSlice";

const taskConfig = {
  url: {
    icon: <LinkIcon size={12} className="text-white" />,
    type: "url",
    color: "#0670F7",
    label: "https://neopod.org",
  },

  text: {
    icon: <LetterTextIcon size={12} className="text-white" />,
    type: "text",
    color: "#ca8a04",
    label: "Your text goes here",
  },

  number: {
    icon: <ArrowUp01Icon size={12} className="text-white" />,
    type: "number",
    color: "#991b1b",
    label: "Your number goes here",
  },
};

const QuestMainTask = ({ name, heading, description, task, questId }) => {
  const dispatch = useDispatch();

  const currentAnswer = useSelector((state) =>
    selectTaskAnswer(state, questId, task.id),
  );

  const currentTaskConfig = useMemo(() => {
    return taskConfig[name];
  }, [name]);

  // Helper function to get display value
  const getDisplayValue = () => {
    if (currentAnswer === null || currentAnswer === undefined) {
      return "";
    }
    return String(currentAnswer);
  };

  // Helper function to validate URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (e) => {
    let value = e.target.value;

    // Handle different input types
    if (name === "number") {
      if (value === "") {
        // Empty string should be null for numbers
        value = null;
      } else {
        const numValue = parseFloat(value);
        // Only update if it's a valid number
        if (!isNaN(numValue)) {
          value = numValue;
        } else {
          // If invalid number, don't update state (keep current value)
          return;
        }
      }
    } else if (name === "text") {
      // For text, empty string should be null to maintain consistency
      value = value === "" ? null : value;
    } else if (name === "url") {
      // For URL, keep as string but we can validate on blur
      value = value === "" ? null : value;
    }

    dispatch(
      updateTaskAnswer({
        questId,
        taskId: task.id,
        answer: value,
      }),
    );
  };

  // Validate URL on blur (optional)
  const handleUrlBlur = (e) => {
    if (name === "url" && e.target.value && !isValidUrl(e.target.value)) {
      addToast({
        color: "warning",
        title: "Invalid URL",
        description: "Please enter a valid URL.",
      });
    }
  };

  // If the provided 'name' doesn't exist in taskConfig, return null
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
        required
        size="lg"
        variant="bordered"
        value={getDisplayValue()}
        onChange={handleInputChange}
        type={currentTaskConfig.type}
        placeholder={currentTaskConfig.label}
        onBlur={name === "url" ? handleUrlBlur : undefined}
        className="bg-dark"
        classNames={{
          input: "text-sm lg:text-base",
          inputWrapper:
            "border-gray-300 focus-within:!border-gray-300 rounded-xl focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black px-2.5 py-1.5 xl:px-4 xl:py-2.5",
        }}
      />
    </QuestTask>
  );
};

export default QuestMainTask;
