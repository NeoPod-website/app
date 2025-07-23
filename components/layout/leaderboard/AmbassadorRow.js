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
import { getContactInfo } from "./leaderboardUtils";

const AmbassadorRow = ({
  ambassador,
  leaderboardType,
  isCurrentUser = false,
}) => {
  const contactInfo = getContactInfo(ambassador);

  return (
    <div
      className={`flex items-center justify-between rounded-2xl p-3 transition-all duration-200 hover:bg-gray-700/50 md:p-4 ${
        isCurrentUser
          ? "from-blue/20 to-pink/20 border-blue/30 border-2 bg-gradient-to-r"
          : "bg-gray-700/20"
      }`}
    >
      <div className="flex gap-2">
        <div className="flex w-12 flex-shrink-0 items-center justify-start md:w-16">
          <RankBadge rank={ambassador.rank} />
        </div>

        <div className="flex w-40 min-w-0 flex-shrink-0 items-center gap-2 sm:w-60 md:w-80 md:gap-4">
          <AvatarWithRole ambassador={ambassador} />

          <UserInfo
            ambassador={ambassador}
            isCurrentUser={isCurrentUser}
            contactInfo={contactInfo}
          />
        </div>

        <RoleSection
          ambassador={ambassador}
          leaderboardType={leaderboardType}
        />
      </div>

      <div className="flex gap-8">
        <PointsSection ambassador={ambassador} />

        <div className="flex w-20 flex-shrink-0 justify-center md:w-20">
          <RankChangeIndicator change={ambassador.rank_change} />
        </div>

        <div className="flex w-8 flex-shrink-0 justify-center md:w-12">
          <div className="rounded-full p-1.5 transition-colors hover:bg-gray-600/50 md:p-2">
            <User size={16} className="text-gray-300 md:h-[18px] md:w-[18px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorRow;
