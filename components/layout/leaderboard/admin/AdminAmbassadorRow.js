import Link from "next/link";
import React, { memo } from "react";
import { EyeIcon } from "lucide-react";

import {
  RankBadge,
  RoleSection,
  PointsSection,
  AvatarWithRole,
  RewardsSection,
  RankChangeIndicator,
} from "../../leaderboard/AmbassadorUI";

const AdminUserInfo = memo(({ ambassador }) => {
  const ambassadorId = ambassador.ambassador_id || "";
  const displayId =
    ambassadorId.length >= 6 ? ambassadorId.slice(-6) : ambassadorId;

  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <p className="truncate text-sm font-medium text-gray-100 md:text-base">
          {ambassador.username}
        </p>

        <span className="bg-blue-500/20 rounded-md px-1.5 py-0.5 text-xs text-blue-300">
          ID: {displayId}
        </span>
      </div>

      <p className="truncate text-xs text-gray-400 md:text-sm">
        Ambassador Profile
      </p>
    </div>
  );
});

AdminUserInfo.displayName = "AdminUserInfo";

const AdminAmbassadorRow = ({ ambassador, leaderboardType }) => {
  return (
    <Link
      href={`/profile/${ambassador.username}`}
      className="flex items-center justify-between rounded-2xl bg-gray-700/20 p-3 transition-all duration-200 hover:bg-gray-700/50 xl:p-4"
    >
      <div className="flex flex-1 lg:gap-2">
        <div className="hidden w-12 flex-shrink-0 items-center justify-start xs:flex lg:w-16">
          <RankBadge rank={ambassador.rank} />
        </div>

        <div className="flex min-w-0 flex-1 flex-shrink-0 items-center gap-2 md:gap-4 lg:w-80 lg:flex-initial">
          <AvatarWithRole ambassador={ambassador} />
          <AdminUserInfo ambassador={ambassador} />
        </div>

        <RoleSection
          ambassador={ambassador}
          leaderboardType={leaderboardType}
        />
      </div>

      <div className="flex gap-8">
        <PointsSection ambassador={ambassador} />

        <div className="hidden w-20 flex-shrink-0 justify-center lg:flex lg:w-20">
          {/* <RankChangeIndicator change={ambassador.rank_change} /> */}
          <RewardsSection ambassador={ambassador} />
        </div>

        <div className="hidden h-8 w-8 flex-shrink-0 items-center justify-center lg:flex xl:h-12 xl:w-12">
          <div className="rounded-full p-1.5 transition-colors hover:bg-gray-600/50 md:p-2">
            <EyeIcon
              size={16}
              className="text-gray-300 md:h-[18px] md:w-[18px]"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default memo(AdminAmbassadorRow);
