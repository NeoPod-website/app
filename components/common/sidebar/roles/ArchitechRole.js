"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Button, Progress } from "@heroui/react";
import { EllipsisVerticalIcon } from "lucide-react";

import SidebarProfile from "../SidebarProfile";

import MainModal from "@/components/ui/modals/MainModal";

const ArchitectProfileImage = () => (
  <Image
    width={44}
    height={20}
    alt="Architect Rank"
    src="/dashboard/profile/architect-star.png"
    className="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2"
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
  const [expanded, setExpanded] = useState(false);

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

  return (
    <>
      <div className="max-w-md border-t border-gray-400 p-4 text-gray-100">
        <div className="flex items-start gap-2.5">
          <Progress
            className="max-w-md"
            color="primary"
            formatOptions={{ style: "decimal", maximumFractionDigits: 0 }}
            label="Tier 4: Architect"
            maxValue={1}
            valueLabel={`∞ / ∞`}
            showValueLabel={true}
            size="md"
            value={1}
            classNames={{
              indicator: "bg-gradient-rank-architect",
              label: "text-gray-100 text-sm",
              value: "text-gray-100 text-sm",
            }}
          />

          <Button
            onPress={() => setExpanded((prev) => !prev)}
            className="h-5 w-5 min-w-0 bg-transparent p-0 hover:bg-gray-700"
          >
            <EllipsisVerticalIcon size={16} />
          </Button>
        </div>
      </div>

      <MainModal
        title="Tier 4: Architect Progress"
        description="You've reached the top. Review your stats, reviewer rank, and how to stay ahead."
        isOpen={expanded}
        handleOnClose={() => setExpanded(false)}
        size="lg"
      >
        <div className="space-y-1.5 text-sm">
          <p>{getStatusMessage()}</p>

          <div className="space-y-1">
            <p>
              <span className="font-bold text-white">Your Points:</span>{" "}
              {points} pts
            </p>
            <p>
              <span className="font-bold text-white">Your Reviews:</span>{" "}
              {reviews}
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
        </div>
      </MainModal>
    </>
  );
};

const ArchitechRole = () => {
  return (
    <>
      <SidebarProfile>
        <ArchitectProfileImage />
      </SidebarProfile>

      <ArchitectProgress rank={10} points={200} reviews={15} />
    </>
  );
};

export default ArchitechRole;
