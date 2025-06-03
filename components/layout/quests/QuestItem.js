import React from "react";
import Link from "next/link";
import { ClockFading, ClockIcon, ImageIcon } from "lucide-react";

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

const QuestItem = ({
  id,
  due_date,
  title = "",
  tasks = [],
  points = 0,
  categoryId,
  rewards = [],
  cooldown = "None",
  recurrence = "Monthly",
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

  return (
    <li>
      <Link
        href={`/quests/${categoryId}/${id}`}
        className="flex items-center justify-between gap-12 rounded-2.5xl border-t border-gray-400 bg-gradient-dark/60 px-5 py-4 shadow shadow-white/10 transition-[colors,shadow] hover:border-gray-200 hover:bg-gradient-dark hover:shadow-white/30"
      >
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <QuestChip
              icon={
                <ClockIcon size={12} className="capitalize text-gray-200" />
              }
              text={recurrence}
            />

            <QuestChip
              icon={
                <ClockFading size={12} className="capitalize text-gray-200" />
              }
              text={cooldown}
            />
          </div>

          <div>
            <h4 className="text-base font-bold text-white">{title}</h4>

            <QuestTimeDisplay due_date={due_date} recurrence={recurrence} />
          </div>

          <div className="flex gap-3">
            <StackedQuests tasks={tasks} />

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

        <RewardCard reward={rewardCardValue} rewardType={rewardCardType} />
      </Link>
    </li>
  );
};

export default QuestItem;
