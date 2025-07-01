"use client";

import {
  UserPlusIcon,
  ShieldAlertIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
} from "lucide-react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect, useMemo } from "react";
import { Button, Card, CardBody, addToast } from "@heroui/react";

import XProfileCard from "./XProfileCard";

import {
  updateTaskAnswer,
  selectTaskAnswer,
  selectIsQuestSubmitted,
} from "@/redux/slice/submissionSlice";

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    const now = new Date();

    const diffTime = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return "Unknown date";
  }
};

const XFollowTask = ({ task, questId, userTwitterHandle }) => {
  const dispatch = useDispatch();

  // Redux selectors
  const currentAnswer = useSelector((state) =>
    selectTaskAnswer(state, questId, task.id),
  );

  const isQuestSubmitted = useSelector((state) =>
    selectIsQuestSubmitted(state, questId),
  );

  // Fix: Proper task completion check - similar to other components
  const isTaskCompleted = useMemo(() => {
    return (
      currentAnswer &&
      typeof currentAnswer === "object" &&
      currentAnswer.verified === true &&
      !isQuestSubmitted // Key fix: Reset when quest is submitted
    );
  }, [currentAnswer, isQuestSubmitted]);

  // Local state
  const [hasFollowed, setHasFollowed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Fix: Reset local state when quest is submitted
  useEffect(() => {
    if (isQuestSubmitted) {
      setHasFollowed(false);
      setShowConfirmation(false);
    }
  }, [isQuestSubmitted]);

  // Also reset local state when currentAnswer is cleared (additional safety)
  useEffect(() => {
    if (!currentAnswer || currentAnswer === null) {
      setHasFollowed(false);
      setShowConfirmation(false);
    }
  }, [currentAnswer]);

  const handleFollowClick = () => {
    // Mark that user has clicked follow
    setHasFollowed(true);
    setShowConfirmation(true);
  };

  const handleConfirmFollow = () => {
    if (!userTwitterHandle) {
      addToast({
        title: "Account Required",
        description: "Please connect your Twitter account first",
        color: "warning",
      });
      return;
    }

    // Update task answer with verification data in Redux
    dispatch(
      updateTaskAnswer({
        questId,
        taskId: task.id,
        answer: {
          verified: true,
          username: task.username,
          verifiedAt: new Date().toISOString(),
          method: "user_confirmation",
          userConfirmed: true,
        },
      }),
    );

    addToast({
      title: "Task Completed!",
      description: `Follow task for @${task.username} marked as complete!`,
      color: "success",
    });

    setShowConfirmation(false);
  };

  const handleProfileLoad = (profileData) => {
    console.log("Profile loaded:", profileData);
  };

  // Generate follow URL with intent
  const followUrl = `https://x.com/intent/follow?screen_name=${task.username}`;
  const profileUrl = `https://x.com/${task.username}`;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {task?.username && (
          <XProfileCard
            username={task.username}
            onProfileLoad={handleProfileLoad}
            showStats={true}
          />
        )}

        <Card className="bg-blue-900/10 border border-blue-500/40">
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <UserPlusIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400" />

              <div className="flex-1">
                <p className="mb-2 text-sm font-medium text-blue-200">
                  Follow Required
                </p>

                <p className="text-sm text-blue-100">
                  Follow @{task?.username || "this account"} on X (Twitter) to
                  complete this quest.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {isQuestSubmitted && (
          <Card className="border border-gray-500/30 bg-gray-900/20">
            <CardBody className="p-4">
              <div className="flex items-start gap-3">
                <ShieldAlertIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />

                <div className="flex-1">
                  <p className="mb-2 text-sm font-medium text-gray-200">
                    How it works:
                  </p>

                  <ol className="list-inside list-decimal space-y-1 text-sm text-gray-300">
                    <li>Click "Follow on X" to open the follow page</li>
                    <li>Follow @{task.username} on X.com</li>
                    <li>
                      Return here and click "Confirm Follow" to complete the
                      task
                    </li>
                  </ol>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {showConfirmation && !isQuestSubmitted && (
          <Card className="border border-amber-500/40 bg-amber-900/10">
            <CardBody className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />

                <div className="flex-1">
                  <p className="mb-2 text-sm font-medium text-amber-200">
                    Ready to Confirm?
                  </p>

                  <p className="text-sm text-amber-100">
                    Have you followed @{task.username} on X? Click "Confirm
                    Follow" below to complete this task.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {isTaskCompleted && (
          <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2">
            <CheckCircleIcon className="h-4 w-4 text-green-400" />
            <p className="text-sm text-green-300">
              ✅ Follow task completed successfully!
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-end gap-3 sm:flex-row">
        <Link
          target="_blank"
          href={followUrl}
          rel="noopener noreferrer"
          className="inline-block w-fit rounded-xl bg-gray-600 text-white transition-colors hover:bg-gray-700"
        >
          <Button
            onPress={handleFollowClick}
            disabled={isTaskCompleted}
            startContent={<UserPlusIcon className="h-4 w-4" />}
            endContent={<ExternalLinkIcon className="h-4 w-4" />}
            className={`w-fit text-white ${
              isTaskCompleted
                ? "cursor-not-allowed bg-gray-500"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isTaskCompleted ? "Already Followed" : "Follow on X"}
          </Button>
        </Link>

        {hasFollowed && !isTaskCompleted && (
          <Button
            onPress={handleConfirmFollow}
            disabled={!userTwitterHandle || isTaskCompleted}
            className="w-fit bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            startContent={<CheckCircleIcon className="h-4 w-4" />}
          >
            Confirm Follow
          </Button>
        )}

        {isTaskCompleted && (
          <Button
            disabled={true}
            className="w-fit cursor-not-allowed bg-green-600 text-white opacity-50"
            startContent={<CheckCircleIcon className="h-4 w-4" />}
          >
            ✅ Completed
          </Button>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-400">
          Having trouble? You can also{" "}
          <Link
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-300"
          >
            visit @{task.username}'s profile
          </Link>{" "}
          directly to follow them.
        </p>
      </div>
    </div>
  );
};

export default XFollowTask;
