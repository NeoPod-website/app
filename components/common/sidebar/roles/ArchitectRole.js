"use client";

import React from "react";
import Link from "next/link";

import SidebarProfile from "../SidebarProfile";
import { ProfileBadge, TierProgressBase } from "./AmbassadorRoles";

const ArchitectProfileImage = () => (
  <ProfileBadge
    width={44}
    height={20}
    alt="Architect Rank"
    src="/dashboard/profile/architect-star.png"
  />
);

const ArchitectProgress = ({ user, stats }) => {
  const rank = stats?.current_month?.role_specific?.rank || 5;
  const points = user?.total_points || 0;
  const totalQuests = user?.total_quests_completed || 0;

  const getStatusMessage = () => {
    return (
      <>
        <strong className="text-white">Congratulations</strong> on reaching
        Architect tier! You've achieved the highest level of ambassador
        excellence. Continue inspiring others and shaping our community's
        future.
      </>
    );
  };

  const modalContent = (
    <div className="space-y-4">
      <p>{getStatusMessage()}</p>

      <div className="space-y-2">
        <p>
          <span className="font-bold text-white">Your Points:</span> {points}{" "}
          points
        </p>

        <p>
          <span className="font-bold text-white">Total Quests:</span>{" "}
          {totalQuests}
        </p>

        <p>
          <span className="font-bold text-white">Your Rank:</span> #{rank}
        </p>

        <p>
          <span className="font-bold text-white">Status:</span> Maximum Tier
          Achieved
        </p>

        <p className="text-sm text-gray-300">
          You've reached the pinnacle of ambassador excellence. Your leadership
          and contributions continue to drive our community forward.
        </p>
      </div>

      <Link
        href="/leaderboard/monthly"
        className="inline-block text-white underline"
      >
        View Leaderboard
      </Link>
    </div>
  );

  return (
    <TierProgressBase
      tierNumber={4}
      tierName="Architect"
      description="You've reached the top. Continue your exceptional leadership."
      gradientClass="bg-gradient-rank-architect"
      progressProps={{
        maxValue: 1,
        value: 1,
        valueLabel: `Maximum Tier`,
      }}
      modalContent={modalContent}
    />
  );
};

const ArchitectRole = ({ user, stats }) => {
  return (
    <>
      <SidebarProfile user={user}>
        <ArchitectProfileImage />
      </SidebarProfile>

      <ArchitectProgress user={user} stats={stats} />
    </>
  );
};

export default ArchitectRole;
