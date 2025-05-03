"use client";

import { Button } from "@heroui/react";
import { InfoIcon } from "lucide-react";
import { Input, Switch } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinkIcon, ArrowUp01Icon, LetterTextIcon } from "lucide-react";

import AdminTaskItem from "./AdminTaskItem";
import QuestTaskContainer from "../../../tasks/QuestTaskContainer";

import RemoveCurrentTask from "@/components/ui/buttons/quest/admin/task/RemoveCurrentTask";
import DuplicateCurrentTask from "@/components/ui/buttons/quest/admin/task/DuplicateCurrentTask";

import { updateCurrentQuestTask } from "@/redux/slice/questSlice";

// Custom hook for debouncing values
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

const typeConfig = {
  text: {
    color: "#ca8a04",
    icon: <LetterTextIcon size={16} />,
    placeholder: "User will enter text here",
    answerLabel: "Expected answer format (users will see this placeholder)",
    adminAnswerLabel: "Correct text answer",
  },
  url: {
    color: "#0670F7",
    icon: <LinkIcon size={16} />,
    placeholder: "User will enter a URL here",
    answerLabel: "URL format (users will see this placeholder)",
    adminAnswerLabel: "Correct URL answer",
  },
  number: {
    color: "#991b1b",
    icon: <ArrowUp01Icon size={16} />,
    placeholder: "User will enter a number here",
    answerLabel: "Number format (users will see this placeholder)",
    adminAnswerLabel: "Correct number answer",
  },
};

// Enhanced answer field component with admin answer option
const AnswerField = ({
  taskId,
  taskName,
  userAnswerLabel,
  userPlaceholder,
}) => {
  const dispatch = useDispatch();

  const currentTasks = useSelector((state) => state.quest.currentQuest.tasks);

  const currentTask = currentTasks.find((task) => task.id === taskId) || {};

  const [localPlaceholder, setLocalPlaceholder] = useState(
    currentTask.placeholder || "",
  );
  const [localAdminAnswer, setLocalAdminAnswer] = useState(
    currentTask.adminAnswer || "",
  );
  const [hasAdminAnswer, setHasAdminAnswer] = useState(
    currentTask.hasAdminAnswer || false,
  );

  const debouncedPlaceholder = useDebounce(localPlaceholder, 300);
  const debouncedAdminAnswer = useDebounce(localAdminAnswer, 300);

  const config = typeConfig[taskName] || typeConfig.text;

  useEffect(() => {
    if (currentTask) {
      setLocalPlaceholder(currentTask.placeholder || "");
      setLocalAdminAnswer(currentTask.adminAnswer || "");
      setHasAdminAnswer(currentTask.hasAdminAnswer || false);
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

    if (debouncedPlaceholder !== currentTask.placeholder) {
      safeUpdateTask({ placeholder: debouncedPlaceholder });
    }
  }, [debouncedPlaceholder, currentTask.placeholder, taskId]);

  useEffect(() => {
    if (!taskId) return;

    if (debouncedAdminAnswer !== currentTask.adminAnswer) {
      safeUpdateTask({ adminAnswer: debouncedAdminAnswer });
    }
  }, [debouncedAdminAnswer, currentTask.adminAnswer, taskId]);

  const handleToggleAdminAnswer = (checked) => {
    setHasAdminAnswer(checked);
    safeUpdateTask({ hasAdminAnswer: checked });
  };

  return (
    <div className="space-y-4">
      <div className="mb-1">
        <div className="mb-1 flex items-center gap-1">
          <label
            htmlFor={`quest-task-${taskName}`}
            className="block text-sm text-gray-300"
          >
            {userAnswerLabel}
          </label>

          <div className="group relative">
            <InfoIcon size={14} className="text-gray-300" />

            <div className="invisible absolute bottom-full left-1/2 mb-2 w-60 -translate-x-1/2 rounded bg-gray-700 p-2 opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100">
              <p className="text-xs text-gray-100">
                This is the placeholder text users will see when completing this
                task. You can customize it to guide them on what to enter.
              </p>
            </div>
          </div>
        </div>

        <Input
          size="lg"
          readOnly
          variant="bordered"
          value={localPlaceholder}
          placeholder={userPlaceholder}
          id={`quest-task-${taskName}`}
          type={taskName === "number" ? "text" : "text"}
          onChange={(e) => setLocalPlaceholder(e.target.value)}
          className="bg-dark"
          classNames={{
            inputWrapper:
              "border-gray-300 rounded-lg focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            input: "placeholder:text-gray-300",
          }}
        />

        <p className="mt-1 text-xs italic text-gray-300">
          This field sets the placeholder for the user's answer input
        </p>
      </div>

      <div className="border-t border-gray-700 pt-2">
        <div className="mb-3 flex items-center gap-2">
          <Switch
            size="sm"
            checked={hasAdminAnswer}
            onChange={(e) => handleToggleAdminAnswer(e.target.checked)}
          />
          <label className="text-sm text-gray-300">
            Set correct answer (for automatic validation)
          </label>
        </div>

        {hasAdminAnswer && (
          <>
            <div className="mb-1">
              <label
                htmlFor={`quest-task-admin-answer-${taskName}`}
                className="mb-1 block text-sm text-gray-300"
              >
                {config.adminAnswerLabel}
              </label>

              <Input
                size="lg"
                variant="bordered"
                value={localAdminAnswer}
                placeholder={
                  taskName === "number"
                    ? "123"
                    : taskName === "url"
                      ? "https://example.com"
                      : "Expected answer"
                }
                id={`quest-task-admin-answer-${taskName}`}
                type={taskName === "number" ? "number" : "text"}
                onChange={(e) => setLocalAdminAnswer(e.target.value)}
                className="bg-dark"
                classNames={{
                  inputWrapper:
                    "border-gray-300 rounded-lg focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
                  input: "placeholder:text-gray-300",
                }}
              />

              <p className="mt-1 text-xs italic text-gray-300">
                User's answer must match this {taskName} exactly to complete the
                task
              </p>
            </div>

            <div className="mt-3 rounded-md bg-red-600/20 p-3">
              <p className="text-xs text-gray-100">
                <strong className="text-red-500">Note:</strong> For{" "}
                {taskName === "text"
                  ? "text answers"
                  : taskName === "url"
                    ? "URLs"
                    : "numbers"}
                ,
                {taskName === "text"
                  ? " the validation is case-sensitive and whitespace matters."
                  : taskName === "url"
                    ? " the protocol (http/https) and trailing slashes are considered in validation."
                    : " the answer must be numerically equivalent."}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const AdminMainTask = ({ index, task }) => {
  const dispatch = useDispatch();

  const currentTasks = useSelector((state) => state.quest.currentQuest.tasks);

  const [currentTask, setCurrentTask] = useState(task);

  useEffect(() => {
    if (task.id) {
      const updatedTask = currentTasks.find((t) => t.id === task.id);

      if (updatedTask) {
        setCurrentTask(updatedTask);
      }
    }
  }, [task.id, currentTasks]);

  const currentType = currentTask.name || "text";
  const config = typeConfig[currentType] || typeConfig.text;

  const handleTypeChange = (newType) => {
    if (!currentTask.id) return;

    dispatch(
      updateCurrentQuestTask({
        id: currentTask.id,
        changes: { name: newType },
      }),
    );
  };

  return (
    <QuestTaskContainer
      icon={config.icon}
      text={currentType}
      color={config.color}
    >
      <section
        className="w-full rounded-2.5xl rounded-tl-none border bg-gradient-dark p-4"
        style={{ borderColor: config.color }}
      >
        <div className="flex justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-300">Task Type</p>

            <div className="flex gap-3">
              {Object.keys(typeConfig).map((typeKey) => {
                const isActive = currentType === typeKey;
                const { icon } = typeConfig[typeKey];

                return (
                  <Button
                    key={typeKey}
                    type="button"
                    onPress={() => handleTypeChange(typeKey)}
                    className={`flex items-center gap-2 rounded-md border px-3 py-2 text-white ${
                      isActive
                        ? "border-white bg-black"
                        : "border-gray-400 bg-transparent text-gray-100"
                    }`}
                  >
                    {icon}
                    {typeKey.charAt(0).toUpperCase() + typeKey.slice(1)}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="mb-3 flex items-start justify-end gap-2">
            <DuplicateCurrentTask currentTask={currentTask} />
            <RemoveCurrentTask currentTask={currentTask} />
          </div>
        </div>

        <hr className="my-4 border-gray-400" />

        <AdminTaskItem taskId={currentTask.id} taskName={currentType}>
          <AnswerField
            taskId={currentTask.id}
            taskName={currentType}
            userAnswerLabel={config.answerLabel}
            userPlaceholder={config.placeholder}
          />
        </AdminTaskItem>
      </section>
    </QuestTaskContainer>
  );
};

export default AdminMainTask;
