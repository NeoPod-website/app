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

const SentinelProgress = ({ user, stats }) => {
  const monthlyPoints = user?.current_month_points || 0;

  const previousRank = stats?.previous_month?.role_specific?.rank;
  const currentRank = stats?.current_month?.role_specific?.rank || 15;

  // Calculate tier level based on ranking
  const getTierLevel = () => {
    if (currentRank <= 3)
      return { level: "Elite", percentage: 100, color: "text-green-400" };
    if (currentRank <= 7)
      return { level: "Excellent", percentage: 85, color: "text-blue-400" };
    if (currentRank <= 12)
      return { level: "Strong", percentage: 70, color: "text-yellow-400" };
    if (currentRank <= 20)
      return { level: "Steady", percentage: 55, color: "text-orange-400" };
    return { level: "Building", percentage: 35, color: "text-gray-400" };
  };

  const tier = getTierLevel();

  const getRankTrend = () => {
    if (!previousRank) return "New";
    if (currentRank < previousRank) return "Rising";
    if (currentRank > previousRank) return "Falling";
    return "Stable";
  };

  const getStatusMessage = () => {
    if (tier.level === "Elite") {
      return (
        <>
          Outstanding! You're in the{" "}
          <strong className="text-white">top 3</strong> Sentinels. Your
          leadership sets the standard for excellence.
        </>
      );
    } else if (tier.level === "Excellent") {
      return (
        <>
          Exceptional work! You're maintaining{" "}
          <strong className="text-white">top-tier status</strong> as a trusted{" "}
          <span className="text-yellow-500">Sentinel</span>.
        </>
      );
    } else if (tier.level === "Strong") {
      return (
        <>
          Solid standing! You're holding your position well in the{" "}
          <strong className="text-white">Sentinel</strong> ranks.
        </>
      );
    } else if (tier.level === "Steady") {
      return (
        <>
          <span className="font-semibold text-yellow-300">Stay focused!</span>{" "}
          Consistent effort will help you climb the rankings.
        </>
      );
    } else {
      return (
        <>
          Keep building momentum! Focus on consistent contributions to
          strengthen your <strong className="text-white">Sentinel</strong>{" "}
          standing.
        </>
      );
    }
  };

  const modalContent = (
    <div className="space-y-4">
      <p>{getStatusMessage()}</p>

      <div className="space-y-2">
        <p>
          <span className="font-bold text-white">Current Rank:</span> #
          {currentRank}
        </p>

        {previousRank && (
          <p>
            <span className="font-bold text-white">Previous Rank:</span> #
            {previousRank}
            <span
              className={`ml-2 text-sm ${
                getRankTrend() === "Rising"
                  ? "text-green-400"
                  : getRankTrend() === "Falling"
                    ? "text-red-400"
                    : "text-gray-400"
              }`}
            >
              ({getRankTrend()})
            </span>
          </p>
        )}

        <p>
          <span className="font-bold text-white">Level:</span>{" "}
          <span className={tier.color}>{tier.level}</span>
        </p>

        <p>
          <span className="font-bold text-white">Monthly Points:</span>{" "}
          {monthlyPoints}
        </p>

        <p className="text-sm text-gray-400">
          Architect promotions are reviewed by administrators based on
          exceptional long-term contributions and leadership.
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
      tierNumber={3}
      tierName="Sentinel"
      description="Elite tier tracking based on your ranking consistency and leadership."
      gradientClass="bg-gradient-rank-sentinel"
      progressProps={{
        maxValue: 100,
        value: tier.percentage,
        valueLabel: tier.level,
      }}
      modalContent={modalContent}
    />
  );
};

const SentinelRole = ({ user, stats }) => {
  return (
    <>
      <SidebarProfile user={user}>
        <SentinelProfileImage />
      </SidebarProfile>

      <SentinelProgress user={user} stats={stats} />
    </>
  );
};

export default SentinelRole;
