"use client";

import React from "react";

import SidebarProfile from "../SidebarProfile";
import { ProfileBadge, TierProgressBase } from "./AmbassadorRoles";

import RequestPromotionBtn from "@/components/ui/buttons/profile/RequestPromotionBtn";

const InitiateProfileImage = () => (
  <ProfileBadge
    width={28}
    height={20}
    alt="Initiate Rank"
    src="/dashboard/profile/initiate-star.png"
  />
);

const InitiateProgress = ({ user, stats }) => {
  const safePoints = user?.total_points || 0;

  const currentRank =
    stats?.current_month?.role_specific?.rank ||
    stats?.all_time?.all_roles?.rank;
  const progress = Math.min((safePoints / 100) * 100, 100);

  const canPromote = safePoints >= 100;

  const getMessage = () => {
    if (safePoints >= 100) {
      return (
        <>
          <strong className="text-white">Congratulations!</strong> You've
          exceeded the maximum points for the Initiate tier.
        </>
      );
    } else if (safePoints >= 90) {
      return (
        <>
          <strong className="text-white">So close!</strong> Just{" "}
          {100 - safePoints} more points and you'll be an{" "}
          <span className="font-semibold text-[#3BAEA1]">Operator</span>!
        </>
      );
    } else if (safePoints >= 30) {
      return (
        <>
          <strong className="text-white">Keep going!</strong> You have{" "}
          <span className="font-bold text-white">{safePoints}</span> points —
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
          earn points and unlock the{" "}
          <span className="font-bold text-[#3BAEA1]">Operator</span> tier. Let's
          get you to <strong>100 points</strong>!
        </>
      );
    }
  };

  const modalContent = (
    <div className="space-y-2">
      <p>{getMessage()}</p>

      <div className="space-y-1">
        {currentRank && (
          <p>
            <span>Current Rank:</span>{" "}
            <strong className="text-white">#{currentRank}</strong>
          </p>
        )}

        <p>
          <span>Current Points:</span>{" "}
          <strong className="text-white">{safePoints} points</strong>
        </p>

        {safePoints < 100 && (
          <p className="text-red-500">
            {100 - safePoints} more points to become an{" "}
            <span className="font-semibold text-[#3BAEA1]">Operator</span>.
          </p>
        )}
      </div>

      {canPromote && (
        <div className="pt-4">
          <RequestPromotionBtn nextRole="operator" />
        </div>
      )}
    </div>
  );

  return (
    <TierProgressBase
      tierNumber={1}
      tierName="Initiate"
      modalContent={modalContent}
      gradientClass="bg-gradient-rank-initiate"
      description="Track your progress and learn how to reach the next tier"
      progressProps={{
        maxValue: 100,
        valueLabel: `${safePoints} / 100 points`,
        value: progress,
      }}
    />
  );
};

const InitiateRole = ({ user, stats }) => {
  return (
    <>
      <SidebarProfile user={user}>
        <InitiateProfileImage />
      </SidebarProfile>

      <InitiateProgress user={user} stats={stats} />
    </>
  );
};

export default InitiateRole;
