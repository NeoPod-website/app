"use client";

import { Input } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SquareArrowOutUpRightIcon } from "lucide-react";

import AdminTaskItem from "./AdminTaskItem";
import QuestTaskContainer from "../../../tasks/QuestTaskContainer";

import RemoveCurrentTask from "@/components/ui/buttons/quest/admin/task/RemoveCurrentTask";
import DuplicateCurrentTask from "@/components/ui/buttons/quest/admin/task/DuplicateCurrentTask";

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

const LinkUrlField = ({ taskId }) => {
  const dispatch = useDispatch();

  const currentTasks = useSelector((state) => state.quest.currentQuest.tasks);

  const currentTask = currentTasks.find((task) => task.id === taskId) || {};

  const [localUrl, setLocalUrl] = useState(currentTask.url || "");

  const debouncedUrl = useDebounce(localUrl, 500);

  useEffect(() => {
    if (currentTask) {
      setLocalUrl(currentTask.url || "");
    }
  }, [currentTask]);

  useEffect(() => {
    if (!taskId) return;

    if (debouncedUrl !== currentTask.url) {
      dispatch(
        updateCurrentQuestTask({
          id: taskId,
          changes: { url: debouncedUrl },
        }),
      );
    }
  }, [debouncedUrl, currentTask.url, taskId, dispatch]);

  return (
    <div className="mb-3">
      <label
        htmlFor="quest-task-visit-link-url"
        className="mb-1 block text-sm text-gray-300"
      >
        Link URL (will be shown to users)
      </label>

      <Input
        required
        size="lg"
        type="url"
        value={localUrl}
        variant="bordered"
        placeholder="https://example.com"
        id="quest-task-visit-link-url"
        onChange={(e) => setLocalUrl(e.target.value)}
        className="bg-dark"
        classNames={{
          inputWrapper:
            "border-gray-300 rounded-lg focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
          input: "placeholder:text-gray-300",
        }}
      />

      <p className="mt-1 text-xs italic text-gray-300">
        Enter the URL that users will need to visit to complete this task
      </p>
    </div>
  );
};

const AdminVisitLinkTask = ({ index, task }) => {
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

  return (
    <QuestTaskContainer
      icon={<SquareArrowOutUpRightIcon size={16} />}
      text="Visit Link"
      color="#0369a1"
    >
      <section
        className="w-full rounded-2.5xl rounded-tl-none border bg-gradient-dark p-4"
        style={{ borderColor: "#0369a1" }}
      >
        <div className="flex justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-300">Visit Link Task</p>
          </div>

          <div className="mb-3 flex items-start justify-end gap-2">
            <DuplicateCurrentTask currentTask={currentTask} />
            <RemoveCurrentTask currentTask={currentTask} />
          </div>
        </div>

        <hr className="my-4 border-gray-400" />

        <AdminTaskItem taskId={currentTask.id} taskName="visit-link">
          <LinkUrlField taskId={currentTask.id} />
        </AdminTaskItem>
      </section>
    </QuestTaskContainer>
  );
};

export default AdminVisitLinkTask;
