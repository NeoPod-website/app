"use client";

import {
  UserPlusIcon,
  ShieldAlertIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
  AlertCircle,
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
  selectIsEditMode,
} from "@/redux/slice/submissionSlice";

// API utilities
const twitterAPI = {
  async verifyFollow(task) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/socials/twitter/verify-follow`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          task,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to verify follow relationship");
    }

    return response.json();
  },
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

  const isEditMode = useSelector((state) => selectIsEditMode(state, questId));

  // Task completion check
  const isTaskCompleted = useMemo(() => {
    // In edit mode, never show as completed so user can edit
    if (isEditMode) return false;

    return (
      currentAnswer &&
      typeof currentAnswer === "object" &&
      currentAnswer.verified === true &&
      !isQuestSubmitted
    );
  }, [currentAnswer, isQuestSubmitted, isEditMode]);

  // Local state
  const [hasFollowed, setHasFollowed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [hasAttemptedVerification, setHasAttemptedVerification] =
    useState(false);

  // Reset local state when quest is submitted
  useEffect(() => {
    if (isQuestSubmitted) {
      setHasFollowed(false);
      setShowConfirmation(false);
      setIsVerifying(false);
      setVerificationResult(null);
      setHasAttemptedVerification(false);
    }
  }, [isQuestSubmitted]);

  // Reset local state when currentAnswer is cleared
  useEffect(() => {
    if (!currentAnswer || currentAnswer === null) {
      setHasFollowed(false);
      setShowConfirmation(false);
      setIsVerifying(false);
      setVerificationResult(null);
      setHasAttemptedVerification(false);
    }
  }, [currentAnswer]);

  const handleFollowClick = () => {
    // Mark that user has clicked follow
    setHasFollowed(true);
    setShowConfirmation(true);
  };

  const handleVerifyFollow = async () => {
    if (!userTwitterHandle) {
      addToast({
        title: "Account Required",
        description: "Please connect your Twitter account first",
        color: "warning",
      });
      return;
    }

    setIsVerifying(true);
    setHasAttemptedVerification(true);

    try {
      const result = await twitterAPI.verifyFollow(task);

      setVerificationResult(result.verificationData);

      if (result.success) {
        // Update task answer with API verification data
        dispatch(
          updateTaskAnswer({
            questId,
            taskId: task.id,
            answer: {
              verified: true,
              sourceUsername: result.verificationData.sourceUsername,
              targetUsername: result.verificationData.targetUsername,
              isFollowing: result.verificationData.isFollowing,
              verifiedAt: result.verificationData.checkedAt,
              method: "api_verification",
            },
          }),
        );

        addToast({
          title: "Follow Verified!",
          description: `Successfully verified that you follow @${task.username}`,
          color: "success",
        });

        setShowConfirmation(false);
      } else {
        addToast({
          title: "Follow Not Verified",
          description: result.message,
          color: "warning",
        });
      }
    } catch (error) {
      setVerificationResult({ error: error.message });
      addToast({
        title: "Verification Failed",
        description: error.message,
        color: "danger",
      });
    } finally {
      setIsVerifying(false);
    }
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

    // Update task answer with user confirmation (fallback method)
    dispatch(
      updateTaskAnswer({
        questId,
        taskId: task.id,
        answer: {
          verified: true,
          userTwitterHandle,
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
    // Profile data loaded successfully
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

        {/* Verification failed - show manual option */}
        {hasAttemptedVerification &&
          !isTaskCompleted &&
          !isVerifying &&
          verificationResult?.verified === false && (
            <Card className="border border-amber-500/40 bg-amber-900/10">
              <CardBody className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />

                  <div className="flex-1">
                    <p className="mb-2 text-sm font-medium text-amber-200">
                      Follow Not Detected
                    </p>

                    <p className="mb-2 text-sm text-amber-100">
                      We couldn't verify that you follow @{task.username}.
                      Please make sure you've followed them and try again, or
                      use manual confirmation below.
                    </p>

                    <p className="text-xs text-amber-200">
                      Note: It may take a few moments for the follow
                      relationship to be detected.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

        {!isQuestSubmitted && !isTaskCompleted && (
          <Card className="border border-gray-500/30 bg-gray-900/20">
            <CardBody className="p-4">
              <div className="flex items-start gap-3">
                <ShieldAlertIcon className="mt-0.5 hidden h-5 w-5 flex-shrink-0 text-gray-300 sm:inline-block" />

                <div className="flex-1">
                  <p className="mb-2 text-sm font-medium text-gray-100">
                    How it works:
                  </p>

                  <ol className="list-inside list-decimal space-y-1 text-sm text-gray-200">
                    <li>Click "Follow on X" to open the follow page</li>
                    <li>Follow @{task.username} on X.com</li>
                    <li>
                      Return here and click "Verify Follow" for automatic
                      verification
                    </li>
                    <li>
                      If verification fails, you can use "Manual Confirm" as a
                      backup
                    </li>
                  </ol>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {showConfirmation && !isTaskCompleted && !isQuestSubmitted && (
          <Card className="border border-amber-500/40 bg-amber-900/10">
            <CardBody className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />

                <div className="flex-1">
                  <p className="mb-2 text-sm font-medium text-amber-200">
                    Ready to Verify?
                  </p>

                  <p className="text-sm text-amber-100">
                    Have you followed @{task.username} on X? Use "Verify Follow"
                    for automatic verification, or "Manual Confirm" if needed.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {isTaskCompleted && !isEditMode && (
          <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2">
            <CheckCircleIcon className="h-4 w-4 text-green-400" />
            <p className="text-sm text-green-300">
              ✅ Follow task completed successfully!
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-row flex-wrap justify-end gap-3">
        <Link
          target="_blank"
          href={followUrl}
          rel="noopener noreferrer"
          className="inline-block w-fit rounded-xl bg-gray-600 text-white transition-colors hover:bg-gray-700"
        >
          <Button
            onPress={handleFollowClick}
            disabled={isTaskCompleted && !isEditMode}
            startContent={<UserPlusIcon className="h-4 w-4" />}
            endContent={<ExternalLinkIcon className="h-4 w-4" />}
            className={`w-fit text-white ${
              isTaskCompleted && !isEditMode
                ? "cursor-not-allowed bg-gray-500"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isTaskCompleted && !isEditMode
              ? "Already Followed"
              : "Follow on X"}
          </Button>
        </Link>

        {hasFollowed && !isTaskCompleted && (
          <Button
            onPress={handleVerifyFollow}
            disabled={!userTwitterHandle || isTaskCompleted || isVerifying}
            isLoading={isVerifying}
            startContent={
              !isVerifying && <CheckCircleIcon className="h-4 w-4" />
            }
            className="w-fit bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {isVerifying ? "Verifying..." : "Verify Follow"}
          </Button>
        )}

        {hasFollowed &&
          !isTaskCompleted &&
          hasAttemptedVerification &&
          !isVerifying && (
            <Button
              onPress={handleConfirmFollow}
              disabled={!userTwitterHandle || isTaskCompleted}
              startContent={<CheckCircleIcon className="h-4 w-4" />}
              className="w-fit bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
            >
              Manual Confirm
            </Button>
          )}

        {isTaskCompleted && !isEditMode && (
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
