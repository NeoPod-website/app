import React from "react";

const TableHeader = ({ leaderboardType }) => (
  <div className="bg-gray-700/30px-3 mb-1 flex items-center justify-between rounded-2xl py-4 text-xs font-medium uppercase tracking-wider text-gray-300 md:text-sm lg:mb-4 2xl:px-4">
    <div className="flex flex-1 gap-2">
      <div className="hidden w-12 xs:inline-block lg:w-16">Rank</div>

      <div className="flex-1 lg:w-80 lg:flex-initial">Ambassador</div>

      {leaderboardType === "all_time" && (
        <div className="hidden w-20 text-center sm:inline-block sm:w-24 md:text-left lg:w-28 lg:text-center xl:w-32">
          Role
        </div>
      )}

      {leaderboardType !== "all_time" && (
        <div className="hidden w-16 text-center sm:inline-block lg:w-20 xl:w-24">
          Quests
        </div>
      )}
    </div>

    <div className="flex gap-8">
      <div className="w-20 text-right sm:w-24 lg:w-28 xl:w-32">Points</div>
      <div className="hidden text-right lg:inline-block lg:w-20">Change</div>
      <div className="hidden text-right lg:inline-block xl:w-12">Profile</div>
    </div>
  </div>
);

export default TableHeader;
