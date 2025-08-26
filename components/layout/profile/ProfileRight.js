import React from "react";

import RankingsCard from "@/components/layout/profile/right/RankingsCard";
import PromotionCard from "@/components/layout/profile/right/PromotionCard";
import QuickInfoCard from "@/components/layout/profile/right/QuickInfoCard";
import StatisticsGrid from "@/components/layout/profile/right/StatisticsGrid";
import TierProgressCard from "@/components/layout/profile/right/TierProgressCard";
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
    </div>
  );
};

export default ProfileRightSidebar;
