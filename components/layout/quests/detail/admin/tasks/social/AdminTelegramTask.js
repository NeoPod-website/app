"use client";

import { Input, Switch } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AdminTaskItem from "../AdminTaskItem";

import QuestTaskContainer from "@/components/layout/quests/tasks/QuestTaskContainer";

import TelegramIcon from "@/components/ui/socialIcons/TelegramIcon";
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

const TelegramChannelSettings = ({ taskId }) => {
  const dispatch = useDispatch();

  const currentTasks = useSelector((state) => state.quest.currentQuest.tasks);

  const currentTask = currentTasks.find((task) => task.id === taskId) || {};

  const [localChannelLink, setLocalChannelLink] = useState(
    currentTask.channelLink || "",
  );
  const [localChannelName, setLocalChannelName] = useState(
    currentTask.channelName || "",
  );
  const [localRequireVerification, setLocalRequireVerification] = useState(
    currentTask.requireVerification || false,
  );
  const [localIsGroup, setLocalIsGroup] = useState(
    currentTask.isGroup || false,
  );

  const debouncedChannelLink = useDebounce(localChannelLink, 500);
  const debouncedChannelName = useDebounce(localChannelName, 500);

  useEffect(() => {
    if (currentTask) {
      setLocalChannelLink(currentTask.channelLink || "");
      setLocalChannelName(currentTask.channelName || "");
      setLocalRequireVerification(currentTask.requireVerification || false);
      setLocalIsGroup(currentTask.isGroup || false);
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

    if (debouncedChannelLink !== currentTask.channelLink) {
      safeUpdateTask({ channelLink: debouncedChannelLink });
    }
  }, [debouncedChannelLink, currentTask.channelLink, taskId]);

  useEffect(() => {
    if (!taskId) return;

    if (debouncedChannelName !== currentTask.channelName) {
      safeUpdateTask({ channelName: debouncedChannelName });
    }
  }, [debouncedChannelName, currentTask.channelName, taskId]);

  const handleVerificationChange = (checked) => {
    setLocalRequireVerification(checked);
    safeUpdateTask({ requireVerification: checked });
  };

  const handleIsGroupChange = (checked) => {
    setLocalIsGroup(checked);
    safeUpdateTask({ isGroup: checked });
  };

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="telegram-channel-name"
          className="mb-1 block text-sm text-gray-300"
        >
          Telegram {localIsGroup ? "Group" : "Channel"} Name
        </label>

        <Input
          required
          size="lg"
          type="text"
          variant="bordered"
          value={localChannelName}
          placeholder="My Telegram Channel"
          id="telegram-channel-name"
          onChange={(e) => setLocalChannelName(e.target.value)}
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
          htmlFor="telegram-channel-link"
          className="mb-1 block text-sm text-gray-300"
        >
          Telegram Link
        </label>

        <Input
          required
          size="lg"
          type="url"
          variant="bordered"
          value={localChannelLink}
          placeholder="https://t.me/yourchannel"
          id="telegram-channel-link"
          onChange={(e) => setLocalChannelLink(e.target.value)}
          className="bg-dark"
          classNames={{
            inputWrapper:
              "border-gray-300 rounded-lg focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            input: "placeholder:text-gray-300",
          }}
        />

        <p className="mt-1 text-xs italic text-gray-300">
          Enter a public Telegram {localIsGroup ? "group" : "channel"} link
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={localIsGroup}
          onChange={(e) => handleIsGroupChange(e.target.checked)}
          size="sm"
          readOnly
        />

        <label className="text-sm text-gray-300">
          This is a group (not a channel)
        </label>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={localRequireVerification}
          onChange={(e) => handleVerificationChange(e.target.checked)}
          size="sm"
          readOnly
        />

        <label className="text-sm text-gray-300">
          Require user to verify Telegram membership
        </label>
      </div>
    </div>
  );
};

const AdminTelegramTask = ({ index, task }) => {
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
      icon={<TelegramIcon className="h-4 w-4" />}
      text="Telegram"
      color="#229ED9"
    >
      <section
        className="w-full rounded-2.5xl rounded-tl-none border bg-gradient-dark p-4"
        style={{ borderColor: "#229ED9" }}
      >
        <div className="flex justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-300">Telegram Task</p>
          </div>

          <div className="mb-3 flex items-start justify-end gap-2">
            <DuplicateCurrentTask currentTask={currentTask} />
            <RemoveCurrentTask currentTask={currentTask} />
          </div>
        </div>

        <hr className="my-4 border-gray-400" />

        <AdminTaskItem taskId={currentTask.id} taskName="telegram">
          <TelegramChannelSettings taskId={currentTask.id} />
        </AdminTaskItem>
      </section>
    </QuestTaskContainer>
  );
};

export default AdminTelegramTask;
