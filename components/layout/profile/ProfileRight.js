import React from "react";

import RankingsCard from "./right/RankingsCard";
import PromotionCard from "./right/PromotionCard";
import QuickInfoCard from "./right/QuickInfoCard";
import StatisticsGrid from "./right/StatisticsGrid";
import RewardClaimCard from "./right/RewardClaimCard";
import TierProgressCard from "./right/TierProgressCard";

import RefreshTokenBtn from "@/components/ui/buttons/profile/RefreshTokenBtn";
import Link from "next/link";
import { Star } from "lucide-react";

const ProfileRightSidebar = ({ user, stats, me, isAdmin = false }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Progress & Rankings</h2>

        {me && <RefreshTokenBtn />}
      </div>

      <TierProgressCard user={user} stats={stats} />

      <Link href="/xps" passHref className="block">
        <div className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-400 bg-gradient-dark px-4 py-3 text-white transition-all duration-200 hover:bg-gradient-dark/60">
          <Star className="h-5 w-5 text-yellow-400" />
          <span className="font-medium">View XP Activity</span>
        </div>
      </Link>

      <StatisticsGrid user={user} />
      <RankingsCard stats={stats} />
      {me && <PromotionCard user={user} stats={stats} />}
      <QuickInfoCard user={user} />
      <RewardClaimCard user={user} me={me} />
    </div>
  );
};

export default ProfileRightSidebar;
