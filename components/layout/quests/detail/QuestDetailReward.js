import React from "react";

import QuestRewardCard from "./QuestRewardCard";

const QuestDetailReward = ({ rewards }) => {
  return (
    <div className="space-y-2 3xl:space-y-5">
      <h3 className="text-xl font-bold 3xl:text-2xl">Rewards</h3>

      <div className="flex gap-4">
        {rewards.map((reward) => (
          <QuestRewardCard
            key={reward.type}
            reward={reward.amount}
            rewardType={reward.type}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestDetailReward;
