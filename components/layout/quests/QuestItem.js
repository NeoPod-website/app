import React from "react";
import Link from "next/link";
import { ClockIcon, ImageIcon } from "lucide-react";

import { QuestChip } from "./detail/QuestChip";
import RewardCard from "./detail/QuestRewardCard";

import StackedQuests from "@/components/layout/quests/StackedQuests";

const QuestItem = ({
  id,
  title,
  tasks,
  points,
  rewards,
  due_date,
  recurrence,
  categoryId,
}) => {
  return (
    <li>
      <Link
        href={`/quests/${categoryId}/${id}`}
        className="flex items-center justify-between gap-12 rounded-2.5xl border-t border-gray-400 bg-gradient-dark/60 px-5 py-4 transition-colors hover:border-gray-200 hover:bg-gradient-dark"
      >
        <div className="flex-1 space-y-3">
          <QuestChip
            icon={<ClockIcon size={12} className="text-gray-200" />}
            text={recurrence}
          />

          <div>
            <h4 className="text-base font-bold text-white">{title}</h4>

            <p className="text-xs text-white">
              Ends in:{" "}
              <span className="font-medium text-yellow-200">{due_date}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <StackedQuests tasks={tasks} />

            <div className="flex w-fit items-center gap-0.5 rounded bg-green-400/50 px-1 py-0.5">
              <ImageIcon size={16} className="text-green-400" />

              <p className="text-xs font-medium text-green-400">{rewards}</p>
            </div>
          </div>
        </div>

        <RewardCard reward={points} rewardType="PODS" />
      </Link>
    </li>
  );
};

export default QuestItem;
