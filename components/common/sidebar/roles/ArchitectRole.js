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

const ArchitectProgress = ({
  rank,
  points,
  reviews,
  reviewRank,
  justBecameArchitect = false,
  tenthPlaceReviewCount = 80,
  topReviewerThreshold = 100,
}) => {
  const reviewGap = Math.max(tenthPlaceReviewCount - reviews, 0);

  const getStatusMessage = () => {
    if (justBecameArchitect) {
      return (
        <>
          🎉 <strong className="text-white">Congratulations</strong> on becoming
          an Architect! Your insights are now shaping our platform. Start
          reviewing and see how your contributions impact the community.
        </>
      );
    }

    if (reviews >= topReviewerThreshold && reviewRank <= 10) {
      return (
        <>
          🌟 <strong className="text-white">Exceptional work</strong>,
          Architect! You're a top reviewer – keep up the fantastic
          contributions!
        </>
      );
    }

    if (reviews >= topReviewerThreshold) {
      return (
        <>
          📈 Thank you for your valuable reviews, Architect! Keep reviewing
          consistently to climb the reviewer rankings.
        </>
      );
    }

    if (reviews >= 20) {
      return (
        <>
          🛠 Your expertise as an Architect is highly appreciated. Consider
          contributing more reviews to further boost your impact and visibility.
        </>
      );
    }

    return (
      <>
        🧱 You're just getting started. Add more reviews to make your mark as an
        Architect and help the community grow!
      </>
    );
  };

  const modalContent = (
    <>
      <p>{getStatusMessage()}</p>

      <div className="space-y-1">
        <p>
          <span className="font-bold text-white">Your Points:</span> {points}{" "}
          pts
        </p>
        <p>
          <span className="font-bold text-white">Your Reviews:</span> {reviews}
        </p>
        <p>
          <span className="font-bold text-white">Your Rank:</span> #{rank}
        </p>
        <p>
          <span className="font-bold text-white">Top 10 Cutoff:</span>{" "}
          {tenthPlaceReviewCount} reviews
        </p>

        {reviewGap > 0 && (
          <p className="text-red-500">
            {reviewGap} more reviews to reach the <strong>Top 10</strong>.
          </p>
        )}
      </div>

      <Link
        href="/leaderboard/reviewers"
        className="inline-block text-white underline"
      >
        View Reviewer Leaderboard
      </Link>

      <Link
        href="/resources/review-guide"
        className="inline-block text-white underline"
      >
        Review Effectively – See Guide
      </Link>
    </>
  );

  return (
    <TierProgressBase
      tierNumber={4}
      tierName="Architect"
      description="You've reached the top. Review your stats, reviewer rank, and how to stay ahead."
      gradientClass="bg-gradient-rank-architect"
      progressProps={{
        maxValue: 1,
        value: 1,
        valueLabel: `∞ / ∞`,
      }}
      modalContent={modalContent}
    />
  );
};

const ArchitectRole = ({ user }) => {
  // Extract user stats if available, otherwise use defaults
  const {
    rank = 10,
    points = 200,
    reviews = 15,
    reviewRank,
    justBecameArchitect = false,
    tenthPlaceReviewCount = 80,
    topReviewerThreshold = 100,
  } = user?.ambassador_stats || {};

  return (
    <>
      <SidebarProfile user={user}>
        <ArchitectProfileImage />
      </SidebarProfile>

      <ArchitectProgress
        rank={rank}
        points={points}
        reviews={reviews}
        reviewRank={reviewRank}
        justBecameArchitect={justBecameArchitect}
        tenthPlaceReviewCount={tenthPlaceReviewCount}
        topReviewerThreshold={topReviewerThreshold}
      />
    </>
  );
};

export default ArchitectRole;
