// import React from "react";
// import { EyeIcon } from "lucide-react";

// import {
//   RankBadge,
//   RoleSection,
//   PointsSection,
//   AvatarWithRole,
//   RankChangeIndicator,
// } from "../../leaderboard/AmbassadorUI";

// const AdminUserInfo = ({ ambassador }) => {
//   return (
//     <div className="min-w-0 flex-1">
//       <div className="flex items-center gap-2">
//         <p className="truncate text-sm font-medium text-gray-100 md:text-base">
//           {ambassador.username}
//         </p>
//         <span className="bg-blue-500/20 rounded-md px-1.5 py-0.5 text-xs text-blue-300">
//           ID: {ambassador.ambassador_id.slice(-6)}
//         </span>
//       </div>
//       <p className="truncate text-xs text-gray-400 md:text-sm">
//         Ambassador Profile
//       </p>
//     </div>
//   );
// };

// const AdminAmbassadorRow = ({ ambassador, leaderboardType }) => {
//   return (
//     <div className="flex items-center justify-between rounded-2xl bg-gray-700/20 p-3 transition-all duration-200 hover:bg-gray-700/50 md:p-4">
//       <div className="flex gap-2">
//         <div className="flex w-12 flex-shrink-0 items-center justify-start md:w-16">
//           <RankBadge rank={ambassador.rank} />
//         </div>

//         <div className="flex w-40 min-w-0 flex-shrink-0 items-center gap-2 sm:w-60 md:w-80 md:gap-4">
//           <AvatarWithRole ambassador={ambassador} />
//           <AdminUserInfo ambassador={ambassador} />
//         </div>

//         <RoleSection
//           ambassador={ambassador}
//           leaderboardType={leaderboardType}
//         />
//       </div>

//       <div className="flex gap-8">
//         <PointsSection ambassador={ambassador} />

//         <div className="flex w-20 flex-shrink-0 justify-center md:w-20">
//           <RankChangeIndicator change={ambassador.rank_change} />
//         </div>

//         <div className="flex w-8 flex-shrink-0 justify-center md:w-12">
//           <div className="rounded-full p-1.5 transition-colors hover:bg-gray-600/50 md:p-2">
//             <EyeIcon
//               size={16}
//               className="text-gray-300 md:h-[18px] md:w-[18px]"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminAmbassadorRow;

import React, { memo } from "react";
import { EyeIcon } from "lucide-react";

import {
  RankBadge,
  RoleSection,
  PointsSection,
  AvatarWithRole,
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
  const handleViewProfile = () => {
    console.log("View profile for:", ambassador.ambassador_id);
  };

  return (
    <div className="flex items-center justify-between rounded-2xl bg-gray-700/20 p-3 transition-all duration-200 hover:bg-gray-700/50 md:p-4">
      <div className="flex gap-2">
        <div className="flex w-12 flex-shrink-0 items-center justify-start md:w-16">
          <RankBadge rank={ambassador.rank} />
        </div>

        <div className="flex w-40 min-w-0 flex-shrink-0 items-center gap-2 sm:w-60 md:w-80 md:gap-4">
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

        <div className="flex w-20 flex-shrink-0 justify-center md:w-20">
          <RankChangeIndicator change={ambassador.rank_change} />
        </div>

        <div className="flex w-8 flex-shrink-0 justify-center md:w-12">
          <button
            onClick={handleViewProfile}
            className="rounded-full p-1.5 transition-colors hover:bg-gray-600/50 md:p-2"
            aria-label={`View ${ambassador.username}'s profile`}
          >
            <EyeIcon
              size={16}
              className="text-gray-300 md:h-[18px] md:w-[18px]"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(AdminAmbassadorRow);
