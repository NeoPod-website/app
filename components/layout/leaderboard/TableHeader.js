import React from "react";

const TableHeader = ({ leaderboardType }) => (
  <div className="mb-4 flex items-center justify-between p-3 text-xs font-medium uppercase tracking-wider text-gray-400 md:p-4 md:text-sm">
    <div className="flex gap-2">
      <div className="w-12 md:w-16">Rank</div>

      <div className="w-40 sm:w-60 md:w-80">Ambassador</div>

      {leaderboardType === "all_time" && (
        <div className="w-20 text-center sm:w-24 md:w-28 lg:w-32">Role</div>
      )}

      {leaderboardType !== "all_time" && (
        <div className="w-16 text-center md:w-20 lg:w-24">Quests</div>
      )}
    </div>

    <div className="flex gap-8">
      <div className="w-20 text-right sm:w-24 md:w-28 lg:w-32">Points</div>
      <div className="w-20 text-center md:w-20">Change</div>
      <div className="w-8 text-center md:w-12">Profile</div>
    </div>
  </div>
);

export default TableHeader;
