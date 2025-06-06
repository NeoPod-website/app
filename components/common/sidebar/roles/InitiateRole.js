"use client";

import React from "react";
import Link from "next/link";

import SidebarProfile from "../SidebarProfile";
import { ProfileBadge, TierProgressBase } from "./AmbassadorRoles";

const InitiateProfileImage = () => (
  <ProfileBadge
    width={28}
    height={20}
    alt="Initiate Rank"
    src="/dashboard/profile/initiate-star.png"
  />
);

const InitiateProgress = ({ rank = 40, points = 0, percentileRank }) => {
  // Ensure points is a valid number for calculations
  const safePoints =
    typeof points === "number" && !isNaN(points) && points >= 0 ? points : 0;

  // Ensure percentileRank is valid if provided
  const safePercentileRank =
    typeof percentileRank === "number" &&
    percentileRank >= 0 &&
    percentileRank <= 100
      ? percentileRank
      : undefined;

  // Safe progress calculation to avoid NaN or invalid percentages
  const progress = Math.min((safePoints / 100) * 100, 100);

  const getMessage = () => {
    if (safePoints >= 90) {
      return (
        <>
          <strong className="text-white">So close!</strong> Just a little more
          effort and you'll be an{" "}
          <span className="font-semibold text-[#3BAEA1]">Operator</span>. You're
          doing great!
        </>
      );
    } else if (safePoints >= 30) {
      return (
        <>
          <strong className="text-white">Keep going!</strong> You're{" "}
          <span className="font-bold text-white">{safePoints}</span> PODS in —
          just{" "}
          <span className="font-bold text-yellow-300">
            {100 - safePoints} more
          </span>{" "}
          to reach{" "}
          <span className="font-semibold text-[#3BAEA1]">Operator</span>.
        </>
      );
    } else {
      return (
        <>
          <strong className="text-white">Welcome!</strong> Start contributing to
          earn PODS and unlock the{" "}
          <span className="font-bold text-[#3BAEA1]">Operator</span> tier. Let's
          get you to <strong>100 PODS</strong>!
        </>
      );
    }
  };

  const modalContent = (
    <>
      <p>{getMessage()}</p>

      <p>
        <span>Current Rank:</span>{" "}
        <strong className="text-white">#{rank}</strong>
      </p>

      <p>
        <span>Current Points:</span>{" "}
        <strong className="text-white">{safePoints} PODS</strong>
      </p>

      {safePoints < 100 && (
        <p className="text-red-500">
          {100 - safePoints} more PODS to become an{" "}
          <span className="font-semibold text-[#3BAEA1]">Operator</span>.
        </p>
      )}

      {safePercentileRank !== undefined && (
        <p>
          You're currently in the{" "}
          <span className="font-semibold text-blue-400">
            top {100 - safePercentileRank}%
          </span>{" "}
          of contributors.
        </p>
      )}

      <Link
        href="/guide/how-to-earn"
        className="inline-block text-white underline"
      >
        How to Earn PODS
      </Link>
    </>
  );

  return (
    <TierProgressBase
      tierNumber={1}
      tierName="Initiate"
      description="Track your progress and learn how to reach the next tier"
      gradientClass="bg-gradient-rank-initiate"
      progressProps={{
        maxValue: 100,
        valueLabel: `${safePoints} / 100 PODS`,
        value: progress,
      }}
      modalContent={modalContent}
    />
  );
};

const InitiateRole = ({ user }) => {
  // Validate user object
  if (!user) {
    console.error("InitiateRole: Missing user object");
    user = {};
  }

  // Extract user stats if available, otherwise use defaults
  // Use safe defaults by destructuring with fallback values
  const {
    rank = 40,
    points = 0,
    percentileRank = 60,
  } = user?.ambassador_stats || {};

  // Ensure points is a non-negative number
  const safePoints = typeof points === "number" && points >= 0 ? points : 0;

  if (safePoints !== points) {
    console.warn(
      `InitiateRole: Invalid points value "${points}", using ${safePoints}`,
    );
  }

  return (
    <>
      <SidebarProfile user={user}>
        <InitiateProfileImage />
      </SidebarProfile>

      <InitiateProgress
        rank={rank}
        points={safePoints}
        percentileRank={percentileRank}
      />
    </>
  );
};

export default InitiateRole;
