import React from "react";
import { Trophy } from "lucide-react";

const RankDisplay = ({ label, rank, subtitle }) => (
  <div className="text-center">
    <p className="mb-1 text-xs text-gray-300">{label}</p>

    <p className="text-xl font-bold text-white">#{rank || "N/A"}</p>

    {subtitle && <p className="text-xs text-gray-100">{subtitle}</p>}
  </div>
);

const RankingsCard = ({ stats }) => {
  const allTimeRank = stats?.all_time?.all_roles?.rank;

  const previousMonthRank = stats?.previous_month?.role_specific;
  const currentMonthRank = stats?.current_month?.role_specific?.rank;

  return (
    <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
      <div className="mb-4 flex items-center gap-3">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h3 className="font-semibold text-white">Your Rankings</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <RankDisplay label="This Month" rank={currentMonthRank} />
        <RankDisplay label="All Time" rank={allTimeRank} />
      </div>

      {previousMonthRank && (
        <div className="mt-4 border-t border-gray-600 pt-4">
          <RankDisplay
            label="Previous Month"
            rank={previousMonthRank.rank}
            subtitle={`${previousMonthRank.points} points`}
          />
        </div>
      )}
    </div>
  );
};

export default RankingsCard;
