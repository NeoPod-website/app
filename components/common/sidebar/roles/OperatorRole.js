// "use client";

// import React from "react";
// import Link from "next/link";

// import SidebarProfile from "../SidebarProfile";
// import { ProfileBadge, TierProgressBase } from "./AmbassadorRoles";

// const OperatorProfileImage = () => (
//   <ProfileBadge
//     width={28}
//     height={20}
//     alt="Operator Rank"
//     src="/dashboard/profile/operator-star.png"
//   />
// );

// const OperatorProgress = ({ userPoints = 0, tenthPlacePoints = 1000 }) => {
//   const hasReachedTop10 = userPoints >= tenthPlacePoints;
//   const ratio = tenthPlacePoints === 0 ? 0 : userPoints / tenthPlacePoints;

//   const getMessage = () => {
//     if (hasReachedTop10) {
//       return (
//         <>
//           <strong className="text-white">Top 10 Achieved!</strong> Amazing job,
//           Operator. Keep pushing forward!
//         </>
//       );
//     } else if (ratio >= 0.8) {
//       return (
//         <>
//           You're <span className="font-bold text-yellow-300">almost there</span>
//           ! Just a little more effort to break into the{" "}
//           <strong className="text-white">Top 10</strong>.
//         </>
//       );
//     } else if (ratio >= 0.6) {
//       return (
//         <>
//           You're progressing steadily. Keep contributing and{" "}
//           <strong>climb the ranks</strong>!
//         </>
//       );
//     } else if (ratio >= 0.3) {
//       return (
//         <>
//           You're getting warmed up. Every point brings you closer to the{" "}
//           <strong>Top 10</strong>!
//         </>
//       );
//     } else {
//       return (
//         <>
//           Welcome to <strong className="text-white">Tier 2: Operator</strong>!
//           Start contributing to earn points and rise up the leaderboard.
//         </>
//       );
//     }
//   };

//   const modalContent = (
//     <>
//       <p>{getMessage()}</p>

//       <p>
//         Your Points: <strong className="text-white">{userPoints} PODS</strong>
//       </p>

//       <p>
//         Top 10 Cutoff:{" "}
//         <strong className="text-white">{tenthPlacePoints} PODS</strong>
//       </p>

//       {!hasReachedTop10 && (
//         <p className="text-red-500">
//           <strong>{tenthPlacePoints - userPoints}</strong> more points to reach{" "}
//           <strong>Top 10</strong>.
//         </p>
//       )}

//       <Link
//         href="/leaderboard/monthly"
//         className="mt-1 inline-block text-white underline"
//       >
//         View Leaderboard
//       </Link>
//     </>
//   );

//   return (
//     <TierProgressBase
//       tierNumber={2}
//       tierName="Operator"
//       description="You're making waves! Track your progress and see what it takes to reach Sentinel status."
//       gradientClass="bg-gradient-rank-operator"
//       progressProps={{
//         maxValue: tenthPlacePoints,
//         value: userPoints,
//         valueLabel: hasReachedTop10
//           ? `Top 10 Achieved`
//           : `${userPoints} / ${tenthPlacePoints} PODS`,
//       }}
//       modalContent={modalContent}
//     />
//   );
// };

// const OperatorRole = ({ user }) => {
//   // Extract user stats if available, otherwise use defaults
//   const { points = 280, tenthPlacePoints = 1000 } =
//     user?.ambassador_stats || {};

//   return (
//     <>
//       <SidebarProfile user={user}>
//         <OperatorProfileImage />
//       </SidebarProfile>

//       <OperatorProgress
//         userPoints={points}
//         tenthPlacePoints={tenthPlacePoints}
//       />
//     </>
//   );
// };

// export default OperatorRole;

"use client";

import React from "react";
import Link from "next/link";

import SidebarProfile from "../SidebarProfile";
import { ProfileBadge, TierProgressBase } from "./AmbassadorRoles";

import RequestPromotionBtn from "@/components/ui/buttons/profile/RequestPromotionBtn";

const OperatorProfileImage = () => (
  <ProfileBadge
    width={28}
    height={20}
    alt="Operator Rank"
    src="/dashboard/profile/operator-star.png"
  />
);

const OperatorProgress = ({ user, stats }) => {
  const userPoints = user?.current_month_points || 0;

  const currentRank = stats?.current_month?.role_specific?.rank;
  const previousMonthRank = stats?.previous_month?.role_specific?.rank;

  const hasReachedTop10 = currentRank && currentRank <= 10;
  const canPromoteToSentinel = previousMonthRank && previousMonthRank <= 10;

  // Mock threshold for progress calculation
  const tenthPlacePoints = 1000;
  const ratio = tenthPlacePoints === 0 ? 0 : userPoints / tenthPlacePoints;

  const getMessage = () => {
    if (canPromoteToSentinel) {
      return (
        <>
          <strong className="text-white">Promotion Available!</strong> Your
          previous month top 10 ranking (#{previousMonthRank}) qualifies you for{" "}
          <span className="font-bold text-purple-400">Sentinel</span> tier!
        </>
      );
    } else if (hasReachedTop10) {
      return (
        <>
          <strong className="text-white">Top 10 This Month!</strong> Amazing
          job, Operator. Keep this performance for Sentinel eligibility!
        </>
      );
    } else if (ratio >= 0.8) {
      return (
        <>
          You're <span className="font-bold text-yellow-300">almost there</span>
          ! Just a little more effort to break into the{" "}
          <strong className="text-white">Top 10</strong>.
        </>
      );
    } else if (ratio >= 0.6) {
      return (
        <>
          You're progressing steadily. Keep contributing and{" "}
          <strong>climb the ranks</strong>!
        </>
      );
    } else if (ratio >= 0.3) {
      return (
        <>
          You're getting warmed up. Every point brings you closer to the{" "}
          <strong>Top 10</strong>!
        </>
      );
    } else {
      return (
        <>
          Welcome to <strong className="text-white">Tier 2: Operator</strong>!
          Build your monthly ranking for Sentinel promotion.
        </>
      );
    }
  };

  const modalContent = (
    <div className="space-y-4">
      <p>{getMessage()}</p>

      <div className="space-y-2">
        <p>
          <span>Monthly Points:</span>{" "}
          <strong className="text-white">{userPoints} points</strong>
        </p>

        {currentRank && (
          <p>
            <span>Current Month Rank:</span>{" "}
            <strong className="text-white">#{currentRank}</strong>
          </p>
        )}

        {previousMonthRank && (
          <p>
            <span>Previous Month Rank:</span>{" "}
            <strong className="text-white">#{previousMonthRank}</strong>
          </p>
        )}

        {!canPromoteToSentinel && (
          <p className="text-yellow-400">
            Reach <strong>top 10</strong> in monthly rankings for Sentinel
            promotion.
          </p>
        )}
      </div>

      {canPromoteToSentinel && (
        <div className="pt-4">
          <RequestPromotionBtn nextRole="sentinel" />
        </div>
      )}

      <Link
        href="/leaderboard/monthly"
        className="inline-block text-white underline"
      >
        View Leaderboard
      </Link>
    </div>
  );

  const progressValue = hasReachedTop10 ? tenthPlacePoints : userPoints;

  return (
    <TierProgressBase
      tierNumber={2}
      tierName="Operator"
      description="You're making waves! Track your progress and see what it takes to reach Sentinel status."
      gradientClass="bg-gradient-rank-operator"
      progressProps={{
        maxValue: tenthPlacePoints,
        value: progressValue,
        valueLabel: hasReachedTop10
          ? `Top 10 Achieved`
          : `${userPoints} / ${tenthPlacePoints} points`,
      }}
      modalContent={modalContent}
    />
  );
};

const OperatorRole = ({ user, stats }) => {
  return (
    <>
      <SidebarProfile user={user}>
        <OperatorProfileImage />
      </SidebarProfile>

      <OperatorProgress user={user} stats={stats} />
    </>
  );
};

export default OperatorRole;
