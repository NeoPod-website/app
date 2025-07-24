// import React from "react";
// import Image from "next/image";
// import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";

// import { getRoleGradient, roleIcons } from "./leaderboardUtils";

// export const RankBadge = ({ rank }) => {
//   if (rank <= 3) {
//     return (
//       <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-xs font-bold text-white md:h-8 md:w-8 md:text-sm">
//         {rank === 1 && <Trophy size={14} className="md:h-4 md:w-4" />}
//         {rank > 1 && rank}
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-600 text-xs font-semibold text-gray-200 md:h-8 md:w-8 md:text-sm">
//       {rank}
//     </div>
//   );
// };

// export const AvatarWithRole = ({ ambassador }) => (
//   <div className="relative flex-shrink-0">
//     <Image
//       width={48}
//       height={48}
//       alt={ambassador.username}
//       src={ambassador.profile_photo || "/dashboard/profile/default-profile.png"}
//       className="h-10 w-10 rounded-full object-cover md:h-12 md:w-12"
//     />

//     <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-gray-600 bg-gray-700 text-xs shadow-md md:h-6 md:w-6">
//       {roleIcons[ambassador.role_type]}
//     </div>
//   </div>
// );

// export const UserInfo = ({ ambassador, isCurrentUser }) => (
//   <div className="min-w-0 flex-1">
//     <div className="flex items-center gap-1 md:gap-2">
//       <h3 className="truncate text-sm font-semibold text-gray-100 md:text-base">
//         {ambassador.username}
//       </h3>

//       {isCurrentUser && (
//         <span className="text-blue border-blue/30 rounded-full border bg-blue/20 px-1.5 py-0.5 text-xs font-medium md:px-2 md:py-1">
//           You
//         </span>
//       )}
//     </div>
//   </div>
// );

// export const RoleSection = ({ ambassador, leaderboardType }) => {
//   if (leaderboardType === "all_time") {
//     return (
//       <div className="flex w-20 flex-shrink-0 flex-col items-center text-center sm:w-24 md:w-28 lg:w-32">
//         <span
//           className={`rounded-full px-2 py-1 text-xs font-medium text-white md:px-3 md:text-sm ${getRoleGradient(ambassador.role_type)} capitalize`}
//         >
//           {ambassador.role_type}
//         </span>

//         <div className="mt-1 text-xs text-gray-200">
//           {ambassador.quest_count} quests
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-16 flex-shrink-0 text-center md:w-20 lg:w-24">
//       <div className="text-base font-bold text-gray-100 md:text-lg">
//         {ambassador.quest_count}
//       </div>

//       <div className="text-xs text-gray-200">quests</div>
//     </div>
//   );
// };

// export const PointsSection = ({ ambassador }) => {
//   const formatLastActivity = (lastActivity) => {
//     if (!lastActivity || lastActivity === "1970-01-01T00:00:00.000Z") {
//       return "No activity";
//     }

//     try {
//       const activityDate = new Date(lastActivity);
//       const now = new Date();

//       if (isNaN(activityDate.getTime())) {
//         return "No activity";
//       }

//       if (activityDate.getTime() === 0) {
//         return "No activity";
//       }

//       const diffInMs = now - activityDate;
//       const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
//       const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
//       const diffInWeeks = Math.floor(diffInDays / 7);

//       if (diffInDays === 0) {
//         if (diffInHours === 0) {
//           return "Active now";
//         }
//         return `${diffInHours}h ago`;
//       } else if (diffInDays === 1) {
//         return "1 day ago";
//       } else if (diffInDays < 7) {
//         return `${diffInDays} days ago`;
//       } else if (diffInWeeks === 1) {
//         return "1 week ago";
//       } else {
//         return `${diffInWeeks} weeks ago`;
//       }
//     } catch (error) {
//       return "No activity";
//     }
//   };

//   return (
//     <div className="w-20 flex-shrink-0 text-right sm:w-24 md:w-28 lg:w-32">
//       <div className="text-sm font-bold text-gray-100 md:text-lg">
//         {ambassador.points.toLocaleString()}
//       </div>

//       <div className="text-xs text-gray-200">
//         {formatLastActivity(ambassador.last_activity)}
//       </div>
//     </div>
//   );
// };

// export const RankChangeIndicator = ({ change }) => {
//   if (change > 0) {
//     return (
//       <div className="flex items-center gap-1 text-green-400">
//         <TrendingUp size={12} />
//         <span className="text-xs font-medium">+{change}</span>
//       </div>
//     );
//   } else if (change < 0) {
//     return (
//       <div className="flex items-center gap-1 text-red-400">
//         <TrendingDown size={12} />
//         <span className="text-xs font-medium">{change}</span>
//       </div>
//     );
//   } else {
//     return (
//       <div className="flex items-center gap-1 text-gray-200">
//         <Minus size={12} />
//         <span className="text-xs font-medium">0</span>
//       </div>
//     );
//   }
// };

import React from "react";
import Image from "next/image";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";

import { getRoleGradient, roleIcons } from "./leaderboardUtils";

export const RankBadge = ({ rank }) => {
  if (rank <= 3) {
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-xs font-bold text-white md:h-8 md:w-8 md:text-sm">
        {rank === 1 && <Trophy size={14} className="md:h-4 md:w-4" />}
        {rank > 1 && rank}
      </div>
    );
  }

  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-600 text-xs font-semibold text-gray-200 md:h-8 md:w-8 md:text-sm">
      {rank}
    </div>
  );
};

export const AvatarWithRole = ({ ambassador }) => (
  <div className="relative flex-shrink-0">
    <Image
      width={48}
      height={48}
      alt={ambassador.username}
      src={ambassador.profile_photo || "/dashboard/profile/default-profile.png"}
      className="h-10 w-10 rounded-full object-cover md:h-12 md:w-12"
    />

    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-gray-600 bg-gray-700 text-xs shadow-md md:h-6 md:w-6">
      {roleIcons[ambassador.role_type]}
    </div>
  </div>
);

export const UserInfo = ({ ambassador, isCurrentUser }) => (
  <div className="min-w-0 flex-1">
    <div className="flex items-center gap-1 md:gap-2">
      <h3 className="truncate text-sm font-semibold text-gray-100 md:text-base">
        {ambassador.username}
      </h3>

      {isCurrentUser && (
        <span className="border-blue/30 text-blue rounded-full border bg-blue/20 px-1.5 py-0.5 text-xs font-medium md:px-2 md:py-1">
          You
        </span>
      )}
    </div>
  </div>
);

export const RoleSection = ({ ambassador, leaderboardType }) => {
  if (leaderboardType === "all_time") {
    return (
      <div className="flex w-20 flex-shrink-0 flex-col items-center text-center sm:w-24 md:w-28 lg:w-32">
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium text-white md:px-3 md:text-sm ${getRoleGradient(ambassador.role_type)} capitalize`}
        >
          {ambassador.role_type}
        </span>

        <div className="mt-1 text-xs text-gray-200">
          {ambassador.quest_count} quests
        </div>
      </div>
    );
  }

  return (
    <div className="w-16 flex-shrink-0 text-center md:w-20 lg:w-24">
      <div className="text-base font-bold text-gray-100 md:text-lg">
        {ambassador.quest_count}
      </div>

      <div className="text-xs text-gray-200">quests</div>
    </div>
  );
};

export const PointsSection = ({ ambassador }) => {
  const formatLastActivity = (lastActivity) => {
    if (!lastActivity || lastActivity === "1970-01-01T00:00:00.000Z") {
      return "No activity";
    }

    try {
      const activityDate = new Date(lastActivity);
      const now = new Date();

      if (isNaN(activityDate.getTime()) || activityDate.getTime() === 0) {
        return "No activity";
      }

      const diffInMs = now - activityDate;

      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      const diffInWeeks = Math.floor(diffInDays / 7);

      if (diffInDays === 0) {
        return diffInHours === 0 ? "Active now" : `${diffInHours}h ago`;
      } else if (diffInDays === 1) {
        return "1 day ago";
      } else if (diffInDays < 7) {
        return `${diffInDays} days ago`;
      } else if (diffInWeeks === 1) {
        return "1 week ago";
      } else {
        return `${diffInWeeks} weeks ago`;
      }
    } catch (error) {
      return "No activity";
    }
  };

  return (
    <div className="w-20 flex-shrink-0 text-right sm:w-24 md:w-28 lg:w-32">
      <div className="text-sm font-bold text-gray-100 md:text-lg">
        {ambassador.points.toLocaleString()}
      </div>

      <div className="text-xs text-gray-200">
        {formatLastActivity(ambassador.last_activity)}
      </div>
    </div>
  );
};

export const RankChangeIndicator = ({ change }) => {
  if (change > 0) {
    return (
      <div className="flex items-center gap-1 text-green-400">
        <TrendingUp size={12} />
        <span className="text-xs font-medium">+{change}</span>
      </div>
    );
  } else if (change < 0) {
    return (
      <div className="flex items-center gap-1 text-red-400">
        <TrendingDown size={12} />
        <span className="text-xs font-medium">{change}</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-1 text-gray-200">
        <Minus size={12} />
        <span className="text-xs font-medium">0</span>
      </div>
    );
  }
};
