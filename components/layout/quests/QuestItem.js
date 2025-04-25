import React from "react";
import { ClockIcon, ImageIcon } from "lucide-react";

import StackedQuests from "@/components/layout/quests/StackedQuests";

const QuestItem = ({ recurrence, title, due_date, rewards, tasks, points }) => {
  return (
    <li className="bg-gradient-dark/60 flex items-center justify-between gap-12 rounded-2.5xl border-t border-gray-400 px-5 py-4">
      <div className="flex-1 space-y-3">
        <div className="flex w-fit items-center gap-0.5 rounded-full bg-gray-600 px-1.5 py-0.5">
          <ClockIcon size={12} className="text-gray-200" />
          <p className="text-xs font-medium text-gray-200">{recurrence}</p>
        </div>

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

      <div className="h-20 w-20 bg-[url('/dashboard/quest/points-background.png')] bg-cover bg-center px-2 py-2">
        <div className="flex h-full w-full flex-col items-center justify-center rounded-md border border-gray-400 bg-black/70 text-center text-white">
          <p className="text-2xl font-bold">{points}</p>
          <span className="block text-sm">PODS</span>
        </div>
      </div>
    </li>
  );
};

export default QuestItem;
