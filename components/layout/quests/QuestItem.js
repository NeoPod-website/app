import {
  Users,
  Clock,
  XCircle,
  ClockIcon,
  ImageIcon,
  ClockFading,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import React from "react";
import Link from "next/link";

import StackedQuests from "./StackedQuests";

import { QuestChip } from "./detail/QuestChip";
import RewardCard from "./detail/QuestRewardCard";
import QuestTimeDisplay from "./detail/QuestTimeDisplay";

// Utility function to process rewards array
const processRewards = (rewards) => {
  if (!Array.isArray(rewards) || rewards.length === 0) {
    return { primaryReward: null, hasSecondaryReward: false, podReward: null };
  }

  try {
    const sortedRewards = [...rewards].sort((a, b) => {
      const priority = { pod: 3, nft: 2, token: 1 };
      return (priority[b?.type] || 0) - (priority[a?.type] || 0);
    });

    const primaryReward = sortedRewards[0];
    const podReward = rewards.find((r) => r?.type === "pod");
    const hasSecondaryReward = rewards.length > 1;

    return { primaryReward, hasSecondaryReward, podReward };
  } catch (error) {
    return { primaryReward: null, hasSecondaryReward: false, podReward: null };
  }
};

// Format next available date
const formatNextAvailableDate = (date) => {
  if (!date) return null;

  const now = new Date();
  const nextDate = new Date(date);
  const diffMs = nextDate - now;

  if (diffMs <= 0) return "Available now";

  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 24) {
    return `Available in ${diffHours}h`;
  } else {
    return `Available in ${diffDays}d`;
  }
};

// Availability status badge component
const AvailabilityBadge = ({
  isAvailable,
  unavailableReason,
  hasCompletedBefore,
  nextAvailableDate,
}) => {
  if (isAvailable) {
    return (
      <QuestChip
        text="Available"
        icon={<CheckCircle size={12} className="text-green-400" />}
        className="border-green-400/30 bg-green-400/10 text-green-400"
      />
    );
  }

  // Determine badge type based on reason
  let icon, text, className;

  if (unavailableReason?.includes("completed")) {
    icon = <CheckCircle size={12} className="text-blue-400" />;
    text = unavailableReason?.includes("one-time")
      ? "Completed"
      : hasCompletedBefore
        ? "Completed"
        : "Done";
    className = "border-blue-400/30 bg-blue-400/10 text-blue-400";
  } else if (unavailableReason?.includes("cooldown")) {
    icon = <Clock size={12} className="text-orange-400" />;
    text = formatNextAvailableDate(nextAvailableDate) || "Cooldown";
    className = "border-orange-400/30 bg-orange-400/10 text-orange-400";
  } else if (unavailableReason?.includes("pending")) {
    icon = <Clock size={12} className="text-yellow-400" />;
    text = "Pending";
    className = "border-yellow-400/30 bg-yellow-400/10 text-yellow-400";
  } else if (
    unavailableReason?.includes("due date") ||
    unavailableReason?.includes("expired")
  ) {
    icon = <XCircle size={12} className="text-red-400" />;
    text = "Expired";
    className = "border-red-400/30 bg-red-400/10 text-red-400";
  } else if (
    unavailableReason?.includes("maximum") ||
    unavailableReason?.includes("Maximum")
  ) {
    icon = <Users size={12} className="text-red-400" />;
    text = "Full";
    className = "border-red-400/30 bg-red-400/10 text-red-400";
  } else if (
    unavailableReason?.includes("requirements") ||
    unavailableReason?.includes("Requirements")
  ) {
    icon = <AlertCircle size={12} className="text-purple-400" />;
    text = "Locked";
    className = "border-purple-400/30 bg-purple-400/10 text-purple-400";
  } else if (unavailableReason?.includes("period")) {
    icon = <Clock size={12} className="text-blue-400" />;
    text = formatNextAvailableDate(nextAvailableDate) || "Wait";
    className = "border-blue-400/30 bg-blue-400/10 text-blue-400";
  } else {
    icon = <XCircle size={12} className="text-gray-400" />;
    text = "Unavailable";
    className = "border-gray-400/30 bg-gray-400/10 text-gray-400";
  }

  return <QuestChip icon={icon} text={text} className={className} />;
};

const QuestItem = ({
  id,
  due_date,
  title = "",
  tasks = [],
  points = 0,
  categoryId,
  rewards = [],
  cooldown = "None",
  recurrence = "None",
  // Quest limit information (using total_submissions)
  claimLimit = null,
  currentClaims = 0,
  // Availability props
  isAvailable = true,
  unavailableReason = "",
  nextAvailableDate = null,
  hasCompletedBefore = false,
}) => {
  // Defensive processing
  const { primaryReward, hasSecondaryReward, podReward } =
    processRewards(rewards);

  const rewardCardValue =
    podReward?.reward || primaryReward?.reward || points || 0;
  const rewardCardType = podReward
    ? "PODS"
    : primaryReward?.type?.toUpperCase() || "PODS";
  const showSecondaryRewardBadge =
    podReward && hasSecondaryReward && Array.isArray(rewards);

  // Quest is only clickable when it's actually available for submission
  const isClickable = isAvailable;
  const questUrl = `/quests/${categoryId}/${id}`;

  const QuestContent = () => (
    <div
      className={`relative flex items-center justify-between gap-4 rounded-2.5xl border-t px-4 py-3 shadow transition-[colors,shadow] 3xl:gap-6 3xl:px-5 3xl:py-4 ${
        isAvailable
          ? "border-gray-400 bg-gradient-dark/60 shadow-white/10 hover:border-gray-200 hover:bg-gradient-dark hover:shadow-white/30"
          : "border-gray-600 bg-gray-700/50 opacity-75 shadow-white/5"
      } ${!isClickable ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className="flex-1 space-y-2 3xl:space-y-3">
        <div className="flex flex-wrap items-center gap-1 3xl:gap-2">
          <AvailabilityBadge
            isAvailable={isAvailable}
            unavailableReason={unavailableReason}
            hasCompletedBefore={hasCompletedBefore}
            nextAvailableDate={nextAvailableDate}
          />

          <QuestChip
            text={recurrence || "One-time"}
            icon={
              <ClockIcon
                size={12}
                className="h-2.5 w-2.5 text-gray-200 3xl:h-3 3xl:w-3"
              />
            }
          />

          <QuestChip
            text={cooldown}
            icon={
              <ClockFading
                size={12}
                className="h-2.5 w-2.5 text-gray-200 3xl:h-3 3xl:w-3"
              />
            }
          />

          {claimLimit && (
            <QuestChip
              text={`${currentClaims}/${claimLimit}`}
              icon={<Users size={12} className="text-blue-400" />}
              className="bg-blue-400/10 h-2.5 w-2.5 border-blue-400/30 text-blue-400 3xl:h-3 3xl:w-3"
            />
          )}
        </div>

        <div>
          <h4
            className={`text-sm font-bold capitalize 3xl:text-base ${isAvailable ? "text-white" : "text-gray-300"}`}
          >
            {title}
          </h4>

          <QuestTimeDisplay due_date={due_date} recurrence={recurrence} />
        </div>

        <div className="flex gap-3">
          {isAvailable ? (
            <StackedQuests tasks={tasks} />
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-gray-700/50 px-3 py-2">
              <div className="h-2 w-2 rounded-full bg-gray-400"></div>
              <p className="text-xs text-gray-100 3xl:text-sm">
                {unavailableReason}
              </p>
            </div>
          )}

          {showSecondaryRewardBadge && (
            <div className="flex w-fit items-center gap-0.5 rounded bg-green-400/50 px-1 py-0.5">
              <ImageIcon size={16} className="text-green-400" />

              <p className="text-xs font-medium text-green-400">
                +{rewards.length - 1} more reward
                {rewards.length > 2 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      </div>

      <RewardCard
        reward={rewardCardValue}
        rewardType={rewardCardType}
        className={!isAvailable ? "opacity-60" : ""}
      />
    </div>
  );

  return (
    <li>
      {isClickable ? (
        <Link href={questUrl} className="block">
          <QuestContent />
        </Link>
      ) : (
        <QuestContent />
      )}
    </li>
  );
};

export default QuestItem;
