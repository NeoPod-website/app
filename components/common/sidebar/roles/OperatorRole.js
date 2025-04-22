"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Button, Progress } from "@heroui/react";
import { EllipsisVerticalIcon } from "lucide-react";

import SidebarProfile from "../SidebarProfile";

import MainModal from "@/components/ui/modals/MainModal";

const OperatorProfileImage = () => (
  <Image
    width={28}
    height={20}
    alt="Operator Rank"
    src="/dashboard/profile/operator-star.png"
    className="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2"
  />
);

const OperatorProgress = ({ userPoints = 0, tenthPlacePoints = 1000 }) => {
  const [expanded, setExpanded] = useState(false);

  const hasReachedTop10 = userPoints >= tenthPlacePoints;
  const ratio = tenthPlacePoints === 0 ? 0 : userPoints / tenthPlacePoints;

  const getMessage = () => {
    if (hasReachedTop10) {
      return (
        <>
          <strong className="text-white">Top 10 Achieved!</strong> Amazing job,
          Operator. Keep pushing forward!
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
          Start contributing to earn points and rise up the leaderboard.
        </>
      );
    }
  };

  return (
    <>
      <div className="border-t border-gray-400 p-3 text-gray-100">
        <div className="flex items-start gap-2.5">
          <Progress
            className="max-w-md"
            color="warning"
            formatOptions={{ style: "decimal", maximumFractionDigits: 0 }}
            label="Tier 2: Operator"
            maxValue={tenthPlacePoints}
            value={userPoints}
            valueLabel={
              hasReachedTop10
                ? `Top 10 Achieved`
                : `${userPoints} / ${tenthPlacePoints} PODS`
            }
            showValueLabel={true}
            size="md"
            classNames={{
              indicator: "bg-gradient-rank-operator",
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
        title="Tier 2: Operator Progress"
        description="You're making waves! Track your progress and see what it takes to reach Sentinel status."
        isOpen={expanded}
        handleOnClose={() => setExpanded(false)}
        size="lg"
      >
        <div className="space-y-1.5 text-sm">
          <p>{getMessage()}</p>

          <p>
            Your Points:{" "}
            <strong className="text-white">{userPoints} PODS</strong>
          </p>

          <p>
            Top 10 Cutoff:{" "}
            <strong className="text-white">{tenthPlacePoints} PODS</strong>
          </p>

          {!hasReachedTop10 && (
            <p className="text-red-500">
              <strong>{tenthPlacePoints - userPoints}</strong> more points to
              reach <strong>Top 10</strong>.
            </p>
          )}

          <Link
            href="/leaderboard/monthly"
            className="mt-1 inline-block text-white underline"
          >
            View Leaderboard
          </Link>
        </div>
      </MainModal>
    </>
  );
};

const OperatorRole = () => {
  return (
    <>
      <SidebarProfile>
        <OperatorProfileImage />
      </SidebarProfile>

      <OperatorProgress userPoints={280} tenthPlacePoints={1000} />
    </>
  );
};

export default OperatorRole;
