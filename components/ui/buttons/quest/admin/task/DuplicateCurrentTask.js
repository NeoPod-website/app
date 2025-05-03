"use client";

import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@heroui/react";
import { CopyIcon } from "lucide-react";
import { useDispatch } from "react-redux";

import { addCurrentQuestTask } from "@/redux/slice/questSlice";

const DuplicateCurrentTask = ({ currentTask }) => {
  const dispatch = useDispatch();

  const handleDuplicateTask = () => {
    if (!currentTask.id) return;

    const duplicatedTask = {
      ...currentTask,
      id: uuidv4(),
      instruction: currentTask.instruction || "",
      description: currentTask.description || "",
      placeholder: currentTask.placeholder || "",
    };

    dispatch(addCurrentQuestTask(duplicatedTask));
  };

  return (
    <Button
      type="button"
      title="Duplicate Task"
      onPress={handleDuplicateTask}
      className="h-8 min-w-0 rounded-md bg-transparent p-2 text-gray-300 hover:bg-gray-600 hover:text-white"
    >
      <CopyIcon size={16} />
    </Button>
  );
};

export default DuplicateCurrentTask;
