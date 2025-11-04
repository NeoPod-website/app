"use client";

import { Users } from "lucide-react";
import { Input } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AdminTaskItem from "./AdminTaskItem";

import QuestTaskContainer from "@/components/layout/quests/tasks/QuestTaskContainer";
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

const InviteTaskSettings = ({ taskId }) => {
  const dispatch = useDispatch();

  const currentTasks = useSelector((state) => state.quest.currentQuest.tasks);
  const currentTask = currentTasks.find((task) => task.id === taskId) || {};

  const [localRequiredInvites, setLocalRequiredInvites] = useState(
    currentTask.requiredInvites || 1,
  );

  const debouncedRequiredInvites = useDebounce(localRequiredInvites, 500);

  // Initialize local state only once when currentTask changes
  useEffect(() => {
    setLocalRequiredInvites(currentTask.requiredInvites || 1);
  }, [currentTask.id]);

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
    if (
      !taskId ||
      debouncedRequiredInvites === (currentTask.requiredInvites || 1)
    )
      return;
    safeUpdateTask({ requiredInvites: debouncedRequiredInvites });
  }, [debouncedRequiredInvites, taskId]);

  const handleRequiredInvitesFocus = (e) => e.target.select();

  const handleRequiredInvitesChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setLocalRequiredInvites("");
      return;
    }

    const numValue = parseInt(value);

    if (!isNaN(numValue) && numValue >= 1) {
      setLocalRequiredInvites(numValue);
    }
  };

  const handleRequiredInvitesBlur = () => {
    if (localRequiredInvites === "" || localRequiredInvites < 1) {
      setLocalRequiredInvites(1);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="required-invites"
          className="mb-1 block text-sm text-gray-300"
        >
          Required Number of Invites
        </label>

        <Input
          required
          size="lg"
          type="number"
          variant="bordered"
          value={localRequiredInvites}
          placeholder="5"
          id="required-invites"
          min="1"
          onChange={handleRequiredInvitesChange}
          onFocus={handleRequiredInvitesFocus}
          onBlur={handleRequiredInvitesBlur}
          className="bg-dark"
          classNames={{
            inputWrapper:
              "border-gray-300 rounded-lg focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            input: "placeholder:text-gray-300",
          }}
        />
        <p className="mt-1 text-xs italic text-gray-300">
          How many valid invites needed to complete this task
        </p>
      </div>

      <div>
        <label
          htmlFor="minimum-xp"
          className="mb-1 block text-sm text-gray-300"
        >
          Minimum XP Required for Valid Invite
        </label>

        <Input
          size="lg"
          type="number"
          variant="bordered"
          value={200}
          readOnly
          id="minimum-xp"
          className="bg-dark"
          classNames={{
            inputWrapper:
              "border-gray-500 rounded-lg opacity-60 cursor-not-allowed",
            input: "text-gray-300 placeholder:text-gray-300",
          }}
        />
        <p className="mt-1 text-xs italic text-gray-400">
          This value is fixed to 200 XP and cannot be changed.
        </p>
      </div>
    </div>
  );
};

const AdminInviteTask = ({ index, task }) => {
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
      icon={<Users className="h-4 w-4" />}
      text="INVITE"
      color="#10b981"
    >
      <section
        className="w-full rounded-2.5xl rounded-tl-none border bg-gradient-dark p-4"
        style={{ borderColor: "#10b981" }}
      >
        <div className="flex justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-300">Invite Friends Task</p>

            {(currentTask.requiredInvites || currentTask.minimumXp) && (
              <p className="text-xs text-gray-400">
                Need {currentTask.requiredInvites || 1} invite
                {(currentTask.requiredInvites || 1) !== 1 ? "s" : ""}
                {currentTask.minimumXp > 0 && (
                  <span> (min {currentTask.minimumXp} XP each)</span>
                )}
              </p>
            )}
          </div>

          <div className="mb-3 flex items-start justify-end gap-2">
            <DuplicateCurrentTask currentTask={currentTask} />
            <RemoveCurrentTask currentTask={currentTask} />
          </div>
        </div>

        <hr className="my-4 border-gray-400" />

        <AdminTaskItem taskId={currentTask.id} taskName="invite">
          <InviteTaskSettings taskId={currentTask.id} />
        </AdminTaskItem>
      </section>
    </QuestTaskContainer>
  );
};

export default AdminInviteTask;
