"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Spinner, Avatar, addToast } from "@heroui/react";
import { Users, Copy, Check, ExternalLink, Gift } from "lucide-react";

import QuestTask from "./QuestTask";

import {
  updateTaskAnswer,
  selectTaskAnswer,
} from "@/redux/slice/submissionSlice";

const QuestInviteTask = ({ task, questId, user }) => {
  task.requiredInvites = 1;

  const dispatch = useDispatch();

  const [copied, setCopied] = useState(false);
  const [invitees, setInvitees] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get current task completion status from Redux
  const currentAnswer = useSelector((state) =>
    selectTaskAnswer(state, questId, task.id),
  );

  // Check if task is completed
  const isCompleted = currentAnswer === true;

  // Generate user's unique invite link
  const generateInviteLink = () => {
    return `${process.env.NEXT_PUBLIC_BASE_URL}/invite?inviteCode=${user?.invite_code || "loading"}`;
  };

  // Fetch invite statistics
  const fetchInviteStats = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/invites/stats`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.success) {
        setInvitees(data.invitees || []);

        // Check if task should be completed based on total invite count
        const totalInvites = data.invitees?.length || 0;

        const shouldBeCompleted = totalInvites >= (task.requiredInvites || 1);

        // Update Redux state if completion status changed
        if (shouldBeCompleted && !isCompleted) {
          dispatch(
            updateTaskAnswer({
              questId,
              answer: true,
              taskId: task.id,
            }),
          );
        } else if (!shouldBeCompleted && isCompleted) {
          dispatch(
            updateTaskAnswer({
              questId,
              answer: false,
              taskId: task.id,
            }),
          );
        }
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to load invite statistics",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInviteStats();
    // Set up polling to check for new invites every 30 seconds
    const interval = setInterval(fetchInviteStats, 30000);
    return () => clearInterval(interval);
  }, [task.id]);

  //  Copy invite link with proper state management
  const copyInviteLink = async () => {
    try {
      const inviteLink = generateInviteLink();

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(inviteLink);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = inviteLink;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }

      setCopied(true);
      addToast({
        title: "Copied!",
        description: "Invite link copied to clipboard",
        color: "success",
      });

      // Fixed: Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to copy invite link",
        color: "danger",
      });
    }
  };

  // Share invite link
  const shareInviteLink = () => {
    const inviteLink = generateInviteLink();
    const text = `Join me on NeoPod and start your Web3 journey! Use my invite link: ${inviteLink}`;

    if (navigator.share && "canShare" in navigator) {
      navigator
        .share({
          title: "Join NeoPod",
          text: text,
          url: inviteLink,
        })
        .catch(console.error);
    } else {
      // Open Twitter share in new tab
      const encodedText = encodeURIComponent(text);
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
      window.open(twitterUrl, "_blank");
    }
  };

  // Count total invites instead of valid invites
  const totalInvites = invitees.length;

  const progress = Math.min(
    (totalInvites / (task.requiredInvites || 1)) * 100,
    100,
  );

  // Don't render if user doesn't have invite code yet
  if (!user?.invite_code) {
    return (
      <QuestTask
        text="INVITE"
        isAdmin={false}
        heading="Invite Friends"
        description="Loading your invite system..."
        icon={<Users size={12} className="text-white" />}
        color="#10b981"
      >
        <div className="flex items-center justify-center py-8">
          <Spinner size="sm" color="primary" />

          <span className="ml-2 text-gray-300">
            Setting up your invite system...
          </span>
        </div>
      </QuestTask>
    );
  }

  return (
    <QuestTask
      text="INVITE"
      isAdmin={false}
      heading="Invite Friends"
      description="Share your unique invite link with friends"
      icon={<Users size={12} className="text-white" />}
      color="#10b981"
    >
      <div className="space-y-4">
        <div
          className={`rounded-xl border p-4 ${
            isCompleted
              ? "border-green-500 bg-green-500/20"
              : "border-gray-400 bg-dark"
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Invite Progress</h3>

            {isCompleted && (
              <div className="flex items-center gap-1 text-green-400">
                <Check className="h-4 w-4" />
                <span className="text-sm">Completed</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-100">Total Invites</span>

              <span className="font-medium text-white">
                {totalInvites} / {task.requiredInvites || 1}
              </span>
            </div>

            <div className="h-2 w-full rounded-full bg-gray-600">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isCompleted ? "bg-green-400" : "bg-green-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-400 bg-dark p-4">
          <h3 className="mb-3 text-lg font-bold text-white">
            Your Invite Link
          </h3>

          <div className="mb-3 flex gap-2">
            <div className="flex-1 rounded-lg border border-gray-400 bg-gray-700 p-3">
              <p className="break-all text-sm text-gray-100">
                {generateInviteLink()}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              isDisabled={copied}
              onPress={copyInviteLink}
              startContent={
                copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )
              }
            >
              {copied ? "Copied!" : "Copy Link"}
            </Button>

            <Button
              size="sm"
              onPress={shareInviteLink}
              className="bg-green-600 hover:bg-green-700"
              startContent={<ExternalLink className="h-4 w-4" />}
            >
              Share
            </Button>
          </div>
        </div>

        {invitees.length > 0 && (
          <div className="rounded-xl border border-gray-400 bg-dark p-4">
            <h3 className="mb-3 text-lg font-bold text-white">Your Invites</h3>

            <div className="max-h-48 space-y-2 overflow-y-auto">
              {invitees.map((invitee, index) => (
                <div
                  key={`${invitee.ambassador_id}-${index}`}
                  className="flex items-center justify-between rounded-lg border border-gray-400 bg-gray-700 p-2"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      size="sm"
                      src={invitee.profile_photo}
                      name={invitee.username || invitee.email}
                      className="bg-gradient-to-r from-blue-500 to-purple-500"
                    />

                    <div>
                      <p className="text-sm font-medium text-white">
                        {invitee.username || invitee.email}
                      </p>
                      <p className="text-xs text-gray-400">
                        Joined{" "}
                        {new Date(invitee.joining_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      {invitee.points || 0} XP
                    </p>
                    <span className="text-xs text-green-400">✓ Counted</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {invitees.length === 0 && !loading && (
          <div className="py-8 text-center">
            <Gift className="mx-auto mb-3 h-12 w-12 text-gray-400" />

            <p className="text-gray-400">No invites yet</p>
            <p className="text-sm text-gray-500">
              Share your link to get started!
            </p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Spinner size="sm" color="primary" />

            <span className="ml-2 text-gray-300">Loading invite data...</span>
          </div>
        )}

        {isCompleted && (
          <div className="mt-2 flex items-center gap-1 text-sm text-green-400">
            <Check className="h-4 w-4" />

            <span>Invite quest completed! You can now submit the quest.</span>
          </div>
        )}
      </div>
    </QuestTask>
  );
};

export default QuestInviteTask;
