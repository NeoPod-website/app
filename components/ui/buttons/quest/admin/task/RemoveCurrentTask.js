"use client";

import React from "react";
import { Button } from "@heroui/react";
import { Trash2Icon } from "lucide-react";
import { useDispatch } from "react-redux";

import { removeCurrentQuestTask } from "@/redux/slice/questSlice";

const RemoveCurrentTask = ({ currentTask }) => {
  const dispatch = useDispatch();

  const handleDeleteTask = () => {
    if (!currentTask.id) return;

    dispatch(removeCurrentQuestTask(currentTask.id));
  };

  return (
    <Button
      type="button"
      title="Delete Task"
      onPress={handleDeleteTask}
      className="h-8 min-w-0 rounded-md bg-transparent p-2 text-gray-300 hover:bg-red-900 hover:text-red-400"
    >
      <Trash2Icon size={16} />
    </Button>
  );
};

export default RemoveCurrentTask;
