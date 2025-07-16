import React from "react";

const QuestRewardCard = ({ reward, rewardType }) => {
  return (
    <div className="h-20 w-20 bg-[url('/dashboard/quest/points-background.png')] bg-cover bg-center px-2 py-2">
      <div className="flex h-full w-full flex-col items-center justify-center rounded-md border border-gray-400 bg-black/70 text-center text-white">
        <p className="text-xl font-bold 3xl:text-2xl">{reward}</p>

        <span className="block text-xs uppercase 3xl:text-sm">
          {rewardType}
        </span>
      </div>
    </div>
  );
};
export default QuestRewardCard;
