"use client";

import React from "react";
import Link from "next/link";

import SidebarProfile from "../SidebarProfile";
import { ProfileBadge, TierProgressBase } from "./AmbassadorRoles";

const SentinelProfileImage = () => (
  <ProfileBadge
    width={36}
    height={20}
    alt="Sentinel Rank"
    src="/dashboard/profile/sentinel-star.png"
  />
);

const SentinelProgress = ({
  rank,
  points,
  cutoffRank = 10,
  cutoffPoints = 1150,
}) => {
  const isInBottom10 = rank > cutoffRank;
  const nearCutoff = rank >= cutoffRank - 2 && rank <= cutoffRank;

  const getStatusMessage = () => {
    if (rank <= cutoffRank - 3) {
      return (
        <>
          You're a{" "}
          <strong className="text-white">
            trusted <span className="text-yellow-500">Sentinel</span>
          </strong>{" "}
          — your expertise is recognized. Keep defending your position!
        </>
      );
    } else if (nearCutoff) {
      return (
        <>
          <span className="font-semibold text-yellow-300">Heads up!</span>{" "}
          You're nearing the cutoff. Stay active to hold your spot in{" "}
          <strong className="text-white">Tier 3</strong>.
        </>
      );
    } else {
      return (
        <>
          You're currently{" "}
          <span className="font-medium text-red-500">below the cutoff</span>.
          Earn <strong>{cutoffPoints - points}</strong> more PODS to stay in{" "}
          <strong className="text-white">
            <span className="text-yellow-500">Sentinel</span> status
          </strong>
          . You've got this!
        </>
      );
    }
  };

  const modalContent = (
    <>
      <p>{getStatusMessage()}</p>

      <p>
        <span className="font-bold text-white">Your Rank:</span> #{rank}
      </p>
      <p>
        <span className="font-bold text-white">Your Points:</span> {points} PODS
      </p>
      <p>
        <span className="font-bold text-white">Cutoff for Tier 3:</span> #
        {cutoffRank} ({cutoffPoints} PODS)
      </p>

      {isInBottom10 && (
        <p className="text-red-500">
          <strong>{cutoffPoints - points}</strong> more points needed to rejoin
          Tier 3.
        </p>
      )}

      <Link
        href="/leaderboard/monthly"
        className="mt-2 inline-block text-white underline"
      >
        View Leaderboard
      </Link>
    </>
  );

  return (
    <TierProgressBase
      tierNumber={3}
      tierName="Sentinel"
      description="Stay sharp and consistent. Review your progress and see how close you are to becoming an Architect."
      gradientClass="bg-gradient-rank-sentinel"
      progressProps={{
        maxValue: cutoffPoints,
        value: points,
        valueLabel: `${points} / ${cutoffPoints} PODS`,
      }}
      modalContent={modalContent}
    />
  );
};

const SentinelRole = ({ user }) => {
  // Extract user stats if available, otherwise use defaults
  const {
    rank = 10,
    points = 1100,
    cutoffRank = 10,
    cutoffPoints = 1150,
  } = user?.ambassador_stats || {};

  return (
    <>
      <SidebarProfile user={user}>
        <SentinelProfileImage />
      </SidebarProfile>

      <SentinelProgress
        rank={rank}
        points={points}
        cutoffRank={cutoffRank}
        cutoffPoints={cutoffPoints}
      />
    </>
  );
};

export default SentinelRole;
