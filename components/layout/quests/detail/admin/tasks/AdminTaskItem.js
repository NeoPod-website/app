"use client";

import { Input, Textarea } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateCurrentQuestTask } from "@/redux/slice/questSlice";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Core AdminTaskItem component that provides common functionality for task editing
 * This component handles instruction and description fields that are common across all task types
 */
const AdminTaskItem = ({
  taskId,
  taskName,
  children,
  hideDescription = false,
}) => {
  const dispatch = useDispatch();
  const currentTasks = useSelector((state) => state.quest.currentQuest.tasks);

  const currentTask = currentTasks.find((task) => task.id === taskId) || {};

  const [localInstructions, setLocalInstructions] = useState(
    currentTask.instruction || "",
  );
  const [localDescription, setLocalDescription] = useState(
    currentTask.description || "",
  );

  const debouncedDescription = useDebounce(localDescription, 300);
  const debouncedInstructions = useDebounce(localInstructions, 300);

  useEffect(() => {
    if (currentTask) {
      setLocalInstructions(currentTask.instruction || "");
      setLocalDescription(currentTask.description || "");
    }
  }, [currentTask]);

  const safeUpdateTask = (changes) => {
    if (!taskId) return;

    const taskExists = currentTasks.some((t) => t.id === taskId);
    if (taskExists) {
      dispatch(
        updateCurrentQuestTask({
          id: taskId,
          changes: changes,
        }),
      );
    } else {
      console.warn(`Task with ID ${taskId} not found, update skipped`);
    }
  };

  useEffect(() => {
    if (!taskId) return;

    if (debouncedInstructions !== currentTask.instruction) {
      safeUpdateTask({ instruction: debouncedInstructions });
    }
  }, [debouncedInstructions, currentTask.instruction, taskId]);

  useEffect(() => {
    if (!taskId || hideDescription) return;

    if (debouncedDescription !== currentTask.description) {
      safeUpdateTask({ description: debouncedDescription });
    }
  }, [debouncedDescription, currentTask.description, taskId, hideDescription]);

  return (
    <div>
      {/* Instruction Field - Common across all tasks */}
      <div className="mb-3">
        <label
          htmlFor={`quest-task-instruction-${taskName}`}
          className="mb-1 block text-sm text-gray-300"
        >
          Task Instruction
        </label>

        <Input
          size="lg"
          value={localInstructions}
          id={`quest-task-instruction-${taskName}`}
          placeholder="Type your instruction or question here"
          onChange={(e) => setLocalInstructions(e.target.value)}
          classNames={{
            base: "bg-transparent border-none shadow-none p-0",
            inputWrapper: "bg-transparent border-none shadow-none rounded-md",
            input: "bg-transparent border-none shadow-none p-0",
          }}
        />
      </div>

      {!hideDescription && (
        <div className="mb-3">
          <label
            className="mb-1 block text-sm text-gray-300"
            htmlFor={`quest-task-description-${taskName}`}
          >
            Description (optional)
          </label>

          <Textarea
            size="lg"
            value={localDescription}
            id={`quest-task-description-${taskName}`}
            onChange={(e) => setLocalDescription(e.target.value)}
            placeholder="Add additional information or guidance for users"
            classNames={{
              base: "bg-transparent border-none shadow-none p-0",
              inputWrapper: "bg-transparent border-none shadow-none rounded-md",
              input: "bg-transparent border-none shadow-none p-0",
            }}
          />
        </div>
      )}

      {children}
    </div>
  );
};

export default AdminTaskItem;
