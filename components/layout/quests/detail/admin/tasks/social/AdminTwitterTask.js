"use client";

import {
  Heart,
  Repeat,
  MicIcon,
  HashIcon,
  UserIcon,
  AtSignIcon,
  MessageCircle,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Switch, Checkbox } from "@heroui/react";

import AdminTaskItem from "../AdminTaskItem";

import RemoveCurrentTask from "@/components/ui/buttons/quest/admin/task/RemoveCurrentTask";
import DuplicateCurrentTask from "@/components/ui/buttons/quest/admin/task/DuplicateCurrentTask";

import { updateCurrentQuestTask } from "@/redux/slice/questSlice";
import QuestTaskContainer from "@/components/layout/quests/tasks/QuestTaskContainer";

// Twitter Task Types
const X_TASK_TYPES = {
  TWEET: "tweet",
  FOLLOW: "follow",
  REACT: "react",
  SPACES: "spaces",
};

// Configuration for each task type
const taskTypeConfig = {
  [X_TASK_TYPES.TWEET]: {
    color: "#1DA1F2",
    icon: <HashIcon size={16} />,
    title: "Tweet",
    description: "User must tweet specific content",
  },
  [X_TASK_TYPES.FOLLOW]: {
    color: "#1DA1F2",
    icon: <UserIcon size={16} />,
    title: "Follow",
    description: "User must follow an account",
  },
  [X_TASK_TYPES.REACT]: {
    color: "#1DA1F2",
    icon: <Heart size={16} />,
    title: "React",
    description: "User must interact with a tweet",
  },
  [X_TASK_TYPES.SPACES]: {
    color: "#1DA1F2",
    icon: <MicIcon size={16} />,
    title: "Spaces",
    description: "User must join a Twitter Space",
  },
};

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

// Tweet Configuration Component
const TweetConfig = ({ taskId }) => {
  const dispatch = useDispatch();

  const currentTasks = useSelector((state) => state.quest.currentQuest.tasks);
  const currentTask = currentTasks.find((task) => task.id === taskId) || {};

  const [includeText, setIncludeText] = useState(currentTask.includeText || "");

  const debouncedIncludeText = useDebounce(includeText, 500);

  useEffect(() => {
    if (taskId && debouncedIncludeText !== currentTask.includeText) {
      dispatch(
        updateCurrentQuestTask({
          id: taskId,
          changes: { includeText: debouncedIncludeText },
        }),
      );
    }
  }, [debouncedIncludeText, currentTask.includeText, taskId, dispatch]);

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm text-gray-300">
          Tweet words (can include mentions, hashtags, or any type of text)
        </label>

        <Input
          size="lg"
          variant="bordered"
          value={includeText}
          onChange={(e) => setIncludeText(e.target.value)}
          placeholder="Enter comma-separated words, hashtags, or mentions (#Neo, @Neo_Blockchain)"
          className="bg-dark"
          classNames={{
            inputWrapper:
              "border-gray-300 rounded-lg focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            input: "placeholder:text-gray-300",
          }}
        />

        <p className="mt-1 text-xs italic text-gray-300">
          These items will be required in the user's tweet. Separate multiple
          items with commas.
        </p>
      </div>

      <div className="mt-3 rounded-md bg-red-600/20 p-3">
        <p className="text-xs text-gray-100">
          <strong className="text-red-500">Note:</strong> The system will verify
          if the user's tweet contains all the required words, hashtags, or
          mentions.
        </p>
      </div>
    </div>
  );
};

// Follow Configuration Component
const FollowConfig = ({ taskId }) => {
  const dispatch = useDispatch();

  const currentTasks = useSelector((state) => state.quest.currentQuest.tasks);
  const currentTask = currentTasks.find((task) => task.id === taskId) || {};

  const [username, setUsername] = useState(currentTask.username || "");

  const debouncedUsername = useDebounce(username, 500);

  useEffect(() => {
    if (taskId && debouncedUsername !== currentTask.username) {
      dispatch(
        updateCurrentQuestTask({
          id: taskId,
          changes: { username: debouncedUsername },
        }),
      );
    }
  }, [debouncedUsername, currentTask.username, taskId, dispatch]);

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm text-gray-300">
          Twitter Username to Follow
        </label>

        <Input
          required
          size="lg"
          type="text"
          variant="bordered"
          value={username}
          onChange={(e) => setUsername(e.target.value.replace("@", ""))}
          placeholder="username (without @)"
          startContent={<AtSignIcon size={16} className="text-gray-400" />}
          className="bg-dark"
          classNames={{
            inputWrapper:
              "border-gray-300 rounded-lg focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            input: "placeholder:text-gray-300",
          }}
        />

        <p className="mt-1 text-xs italic text-gray-300">
          Enter the Twitter username that users need to follow (without the @
          symbol)
        </p>
      </div>
    </div>
  );
};

// React Configuration Component
const ReactConfig = ({ taskId }) => {
  const dispatch = useDispatch();

  const currentTasks = useSelector((state) => state.quest.currentQuest.tasks);
  const currentTask = currentTasks.find((task) => task.id === taskId) || {};

  const [tweetUrl, setTweetUrl] = useState(currentTask.tweetUrl || "");

  const [requireLike, setRequireLike] = useState(
    currentTask.requireLike || true,
  );

  const [requireRetweet, setRequireRetweet] = useState(
    currentTask.requireRetweet || false,
  );

  const [requireReply, setRequireReply] = useState(
    currentTask.requireReply || false,
  );

  const debouncedTweetUrl = useDebounce(tweetUrl, 500);

  useEffect(() => {
    if (!taskId) return;

    if (debouncedTweetUrl !== currentTask.tweetUrl) {
      dispatch(
        updateCurrentQuestTask({
          id: taskId,
          changes: { tweetUrl: debouncedTweetUrl },
        }),
      );
    }
  }, [debouncedTweetUrl, currentTask.tweetUrl, taskId, dispatch]);

  const handleInteractionChange = (type, value) => {
    if (!taskId) return;

    const changes = {};
    changes[type] = value;

    dispatch(
      updateCurrentQuestTask({
        id: taskId,
        changes: changes,
      }),
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm text-gray-300">Tweet URL</label>

        <Input
          required
          type="url"
          size="lg"
          variant="bordered"
          value={tweetUrl}
          onChange={(e) => setTweetUrl(e.target.value)}
          placeholder="https://x.com/username/status/1234567890"
          className="bg-dark"
          classNames={{
            inputWrapper:
              "border-gray-300 rounded-lg focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            input: "placeholder:text-gray-300",
          }}
        />

        <p className="mt-1 text-xs italic text-gray-300">
          Enter the full URL of the tweet that users need to interact with
        </p>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <label className="mb-2 block text-sm text-gray-300">
          Required Interactions
        </label>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              isSelected={requireLike}
              onChange={() => {
                const newValue = !requireLike;
                setRequireLike(newValue);
                handleInteractionChange("requireLike", newValue);
              }}
            />

            <div className="flex items-center gap-1 text-gray-300">
              <Heart size={16} className="text-red-500" />
              <span>Like</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              isSelected={requireRetweet}
              onChange={() => {
                const newValue = !requireRetweet;
                setRequireRetweet(newValue);
                handleInteractionChange("requireRetweet", newValue);
              }}
            />

            <div className="flex items-center gap-1 text-gray-300">
              <Repeat size={16} className="text-green-500" />
              <span>Retweet</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              isSelected={requireReply}
              onChange={() => {
                const newValue = !requireReply;
                setRequireReply(newValue);
                handleInteractionChange("requireReply", newValue);
              }}
            />

            <div className="flex items-center gap-1 text-gray-300">
              <MessageCircle size={16} className="text-blue-500" />
              <span>Reply</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-md bg-red-600/20 p-3">
        <p className="text-xs text-gray-100">
          <strong className="text-red-500">Note:</strong> Select at least one
          interaction type that users must perform on the tweet.
        </p>
      </div>
    </div>
  );
};

// Spaces Configuration Component
const SpacesConfig = ({ taskId }) => {
  const dispatch = useDispatch();

  const currentTasks = useSelector((state) => state.quest.currentQuest.tasks);
  const currentTask = currentTasks.find((task) => task.id === taskId) || {};

  const [spaceUrl, setSpaceUrl] = useState(currentTask.spaceUrl || "");
  const [requirePassword, setRequirePassword] = useState(
    currentTask.requirePassword || false,
  );
  const [spacePassword, setSpacePassword] = useState(
    currentTask.spacePassword || "",
  );

  const debouncedSpaceUrl = useDebounce(spaceUrl, 500);
  const debouncedSpacePassword = useDebounce(spacePassword, 500);

  useEffect(() => {
    if (!taskId) return;

    if (debouncedSpaceUrl !== currentTask.spaceUrl) {
      dispatch(
        updateCurrentQuestTask({
          id: taskId,
          changes: { spaceUrl: debouncedSpaceUrl },
        }),
      );
    }
  }, [debouncedSpaceUrl, currentTask.spaceUrl, taskId, dispatch]);

  useEffect(() => {
    if (!taskId) return;

    if (debouncedSpacePassword !== currentTask.spacePassword) {
      dispatch(
        updateCurrentQuestTask({
          id: taskId,
          changes: { spacePassword: debouncedSpacePassword },
        }),
      );
    }
  }, [debouncedSpacePassword, currentTask.spacePassword, taskId, dispatch]);

  const handleRequirePasswordChange = (checked) => {
    setRequirePassword(checked);
    dispatch(
      updateCurrentQuestTask({
        id: taskId,
        changes: { requirePassword: checked },
      }),
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm text-gray-300">
          Twitter Space URL
        </label>

        <Input
          required
          size="lg"
          type="url"
          variant="bordered"
          value={spaceUrl}
          onChange={(e) => setSpaceUrl(e.target.value)}
          placeholder="https://twitter.com/i/spaces/123456789"
          className="bg-dark"
          classNames={{
            inputWrapper:
              "border-gray-300 rounded-lg focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
            input: "placeholder:text-gray-300",
          }}
        />

        <p className="mt-1 text-xs italic text-gray-300">
          Enter the full URL of the Twitter Space
        </p>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <div className="mb-3 flex items-center gap-2">
          <Switch
            size="sm"
            isSelected={requirePassword}
            onValueChange={(value) => handleRequirePasswordChange(value)}
          />

          <label className="text-sm text-gray-300">
            Require password verification
          </label>
        </div>

        {requirePassword && (
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Space Password
            </label>

            <Input
              size="lg"
              variant="bordered"
              value={spacePassword}
              onChange={(e) => setSpacePassword(e.target.value)}
              placeholder="Enter the password users need to provide"
              className="bg-dark"
              classNames={{
                inputWrapper:
                  "border-gray-300 rounded-lg focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black",
                input: "placeholder:text-gray-300",
              }}
            />

            <p className="mt-1 text-xs italic text-gray-300">
              This password will be announced during the Space event
            </p>
          </div>
        )}
      </div>

      <div className="mt-3 rounded-md bg-red-600/20 p-3">
        <p className="text-xs text-gray-100">
          <strong className="text-red-500">Note:</strong> The system will verify
          user attendance at the Space. If password is enabled, users will need
          to enter the correct password to complete the task.
        </p>
      </div>
    </div>
  );
};

const AdminTwitterTask = ({ index, task }) => {
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

  const currentType = currentTask.twitterTaskType || X_TASK_TYPES.TWEET;
  const config = taskTypeConfig[currentType];

  const handleTypeChange = (newType) => {
    if (!currentTask.id) return;

    dispatch(
      updateCurrentQuestTask({
        id: currentTask.id,
        changes: { twitterTaskType: newType },
      }),
    );
  };

  // Render the appropriate configuration based on task type
  const renderTaskConfig = () => {
    switch (currentType) {
      case X_TASK_TYPES.TWEET:
        return <TweetConfig taskId={currentTask.id} />;
      case X_TASK_TYPES.FOLLOW:
        return <FollowConfig taskId={currentTask.id} />;
      case X_TASK_TYPES.REACT:
        return <ReactConfig taskId={currentTask.id} />;
      case X_TASK_TYPES.SPACES:
        return <SpacesConfig taskId={currentTask.id} />;
      default:
        return null;
    }
  };

  return (
    <QuestTaskContainer
      icon={config.icon}
      text={config.title}
      color={config.color}
    >
      <section
        className="w-full rounded-2.5xl rounded-tl-none border bg-gradient-dark p-4"
        style={{ borderColor: config.color }}
      >
        <div className="flex justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-300">Twitter Task Type</p>

            <div className="flex flex-wrap gap-3">
              {Object.keys(X_TASK_TYPES).map((typeKey) => {
                const taskType = X_TASK_TYPES[typeKey];
                const isActive = currentType === taskType;
                const { icon, title } = taskTypeConfig[taskType];

                return (
                  <button
                    key={typeKey}
                    type="button"
                    onClick={() => handleTypeChange(taskType)}
                    className={`flex items-center gap-2 rounded-md border px-3 py-2 text-white ${
                      isActive
                        ? "border-white bg-black"
                        : "border-gray-400 bg-transparent text-gray-100"
                    }`}
                  >
                    {icon}
                    {title}
                  </button>
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
          {renderTaskConfig()}
        </AdminTaskItem>
      </section>
    </QuestTaskContainer>
  );
};

export default AdminTwitterTask;
