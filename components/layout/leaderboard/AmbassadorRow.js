import React from "react";
import { User } from "lucide-react";

import {
  UserInfo,
  RankBadge,
  RoleSection,
  PointsSection,
  AvatarWithRole,
  RankChangeIndicator,
} from "./AmbassadorUI";
import Link from "next/link";

const AmbassadorRow = ({
  ambassador,
  leaderboardType,
  isCurrentUser = false,
}) => {
  return (
    <Link
      href={`/profile/${ambassador.username}`}
      className={`flex items-center justify-start rounded-2xl p-3 transition-all duration-200 hover:bg-gray-700/50 lg:justify-between 2xl:p-4 ${
        isCurrentUser
          ? "from-blue/20 to-pink/20 border-blue/30 border-2 bg-gradient-to-r"
          : "bg-gray-700/20"
      }`}
    >
      <div className="flex flex-1 lg:gap-2">
        <div className="hidden w-12 flex-shrink-0 items-center justify-start xs:flex lg:w-16">
          <RankBadge rank={ambassador.rank} />
        </div>

        <div className="flex min-w-0 flex-1 flex-shrink-0 items-center gap-2 md:gap-4 lg:w-80 lg:flex-initial">
          <AvatarWithRole ambassador={ambassador} />
          <UserInfo ambassador={ambassador} isCurrentUser={isCurrentUser} />
        </div>

        <RoleSection
          ambassador={ambassador}
          leaderboardType={leaderboardType}
        />
      </div>

      <div className="flex items-center gap-8">
        <PointsSection ambassador={ambassador} />

        <div className="hidden w-20 flex-shrink-0 justify-center lg:flex lg:w-20">
          <RankChangeIndicator change={ambassador.rank_change} />
        </div>

        <div className="hidden h-8 w-8 flex-shrink-0 items-center justify-center lg:flex xl:h-12 xl:w-12">
          <div className="rounded-full p-1.5 transition-colors hover:bg-gray-600/50 md:p-2">
            <User size={16} className="text-gray-300 md:h-[18px] md:w-[18px]" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AmbassadorRow;
