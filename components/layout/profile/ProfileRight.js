import React from "react";

import RankingsCard from "./right/RankingsCard";
import PromotionCard from "./right/PromotionCard";
import QuickInfoCard from "./right/QuickInfoCard";
import StatisticsGrid from "./right/StatisticsGrid";
import RewardClaimCard from "./right/RewardClaimCard";
import TierProgressCard from "./right/TierProgressCard";

import RefreshTokenBtn from "@/components/ui/buttons/profile/RefreshTokenBtn";

const ProfileRightSidebar = ({ user, stats, me }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Progress & Rankings</h2>

        <RefreshTokenBtn />
      </div>

      <TierProgressCard user={user} stats={stats} />
      <StatisticsGrid user={user} />
      <RankingsCard stats={stats} />
      {me && <PromotionCard user={user} stats={stats} />}
      <QuickInfoCard user={user} />
      <RewardClaimCard user={user} me={me} />
    </div>
  );
};

export default ProfileRightSidebar;
