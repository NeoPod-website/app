"use client";

import { Input, Switch } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AdminTaskItem from "../AdminTaskItem";

import QuestTaskContainer from "@/components/layout/quests/tasks/QuestTaskContainer";

import DiscordIcon from "@/components/ui/socialIcons/DiscordIcon";
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

const DiscordServerSettings = ({ taskId }) => {
  const dispatch = useDispatch();

  const currentTasks = useSelector((state) => state.quest.currentQuest.tasks);

  const currentTask = currentTasks.find((task) => task.id === taskId) || {};

  const [localInviteLink, setLocalInviteLink] = useState(
    currentTask.inviteLink || "",
  );
  const [localServerName, setLocalServerName] = useState(
    currentTask.serverName || "",
  );
  const [localRequireVerification, setLocalRequireVerification] = useState(
    currentTask.requireVerification || false,
  );

  const debouncedInviteLink = useDebounce(localInviteLink, 500);
  const debouncedServerName = useDebounce(localServerName, 500);

  useEffect(() => {
    if (currentTask) {
      setLocalInviteLink(currentTask.inviteLink || "");
      setLocalServerName(currentTask.serverName || "");
      setLocalRequireVerification(currentTask.requireVerification || false);
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

    if (debouncedInviteLink !== currentTask.inviteLink) {
      safeUpdateTask({ inviteLink: debouncedInviteLink });
    }
  }, [debouncedInviteLink, currentTask.inviteLink, taskId]);

  useEffect(() => {
    if (!taskId) return;

    if (debouncedServerName !== currentTask.serverName) {
      safeUpdateTask({ serverName: debouncedServerName });
    }
  }, [debouncedServerName, currentTask.serverName, taskId]);

  const handleVerificationChange = (checked) => {
    setLocalRequireVerification(checked);
    safeUpdateTask({ requireVerification: checked });
  };

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="discord-server-name"
          className="mb-1 block text-sm text-gray-300"
        >
          Discord Server Name
        </label>

        <Input
          required
          size="lg"
          type="text"
          variant="bordered"
          value={localServerName}
          placeholder="My Community Server"
          id="discord-server-name"
          onChange={(e) => setLocalServerName(e.target.value)}
          className="bg-dark"
          classNames={{
            inputWrapper:
              "border-gray-300 rounded-lg focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            input: "placeholder:text-gray-300",
          }}
        />
      </div>

      <div>
        <label
          htmlFor="discord-invite-link"
          className="mb-1 block text-sm text-gray-300"
        >
          Discord Invite Link
        </label>

        <Input
          required
          size="lg"
          type="url"
          variant="bordered"
          value={localInviteLink}
          placeholder="https://discord.gg/your-invite-code"
          id="discord-invite-link"
          onChange={(e) => setLocalInviteLink(e.target.value)}
          className="bg-dark"
          classNames={{
            inputWrapper:
              "border-gray-300 rounded-lg focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            input: "placeholder:text-gray-300",
          }}
        />

        <p className="mt-1 text-xs italic text-gray-300">
          Enter a never-expiring Discord invite link
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          size="sm"
          isSelected={localRequireVerification}
          onValueChange={(value) => handleVerificationChange(value)}
        />

        <label className="text-sm text-gray-300">
          Require user to verify Discord membership
        </label>
      </div>
    </div>
  );
};

const AdminDiscordTask = ({ index, task }) => {
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
      icon={<DiscordIcon className="h-4 w-4" />}
      text="Discord"
      color="#5865F2"
    >
      <section
        className="w-full rounded-2.5xl rounded-tl-none border bg-gradient-dark p-4"
        style={{ borderColor: "#5865F2" }}
      >
        <div className="flex justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-300">Discord Server Task</p>
          </div>

          <div className="mb-3 flex items-start justify-end gap-2">
            <DuplicateCurrentTask currentTask={currentTask} />
            <RemoveCurrentTask currentTask={currentTask} />
          </div>
        </div>

        <hr className="my-4 border-gray-400" />

        <AdminTaskItem taskId={currentTask.id} taskName="discord">
          <DiscordServerSettings taskId={currentTask.id} />
        </AdminTaskItem>
      </section>
    </QuestTaskContainer>
  );
};

export default AdminDiscordTask;
