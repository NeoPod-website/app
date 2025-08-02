import React from "react";

const QuestRewardCard = ({ reward, rewardType }) => {
  return (
    <div className="h-16 w-16 bg-[url('/dashboard/quest/points-background.png')] bg-cover bg-center p-1.5 xl:h-20 xl:w-20 xl:p-2">
      <div className="flex h-full w-full flex-col items-center justify-center rounded-md border border-gray-400 bg-black/70 text-center text-white">
        <p className="text-xl font-bold 3xl:text-2xl">{reward}</p>

        <span className="block text-xs uppercase 3xl:text-sm">
          {rewardType === "PODS" ? "XPs" : rewardType}
        </span>
      </div>
    </div>
  );
};
export default QuestRewardCard;
