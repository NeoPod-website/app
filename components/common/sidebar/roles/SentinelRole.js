"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Button, Progress } from "@heroui/react";
import { EllipsisVerticalIcon } from "lucide-react";

import SidebarProfile from "../SidebarProfile";

import MainModal from "@/components/ui/modals/MainModal";

const SentinelProfileImage = () => (
  <Image
    width={36}
    height={20}
    alt="Sentinel Rank"
    src="/dashboard/profile/sentinel-star.png"
    className="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2"
  />
);

const SentinelProgress = ({
  rank,
  points,
  cutoffRank = 10,
  cutoffPoints = 1150,
}) => {
  const [expanded, setExpanded] = useState(false);

  const progress = Math.min((points / cutoffPoints) * 100, 100);
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
          . You’ve got this!
        </>
      );
    }
  };

  return (
    <>
      <div className="border-t border-gray-400 p-4 text-gray-100">
        <div className="flex items-start gap-2.5">
          <Progress
            className="max-w-md"
            color="warning"
            formatOptions={{ style: "decimal", maximumFractionDigits: 0 }}
            label="Tier 3: Sentinel"
            maxValue={cutoffPoints}
            valueLabel={`${points} / ${cutoffPoints} PODS`}
            showValueLabel={true}
            size="md"
            value={points}
            classNames={{
              indicator: "bg-gradient-rank-sentinel",
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
        title="Tier 3: Sentinel Progress"
        description="Stay sharp and consistent. Review your progress and see how close you are to becoming an Architect."
        isOpen={expanded}
        handleOnClose={() => setExpanded(false)}
        size="lg"
      >
        <div className="space-y-2 text-sm">
          <p>{getStatusMessage()}</p>

          <p>
            <span className="font-bold text-white">Your Rank:</span> #{rank}
          </p>
          <p>
            <span className="font-bold text-white">Your Points:</span> {points}{" "}
            PODS
          </p>
          <p>
            <span className="font-bold text-white">Cutoff for Tier 3:</span> #
            {cutoffRank} ({cutoffPoints} PODS)
          </p>

          {isInBottom10 && (
            <p className="text-red-500">
              <strong>{cutoffPoints - points}</strong> more points needed to
              rejoin Tier 3.
            </p>
          )}

          <Link
            href="/leaderboard/monthly"
            className="mt-2 inline-block text-white underline"
          >
            View Leaderboard
          </Link>
        </div>
      </MainModal>
    </>
  );
};

const SentinelRole = () => {
  return (
    <>
      <SidebarProfile>
        <SentinelProfileImage />
      </SidebarProfile>

      <SentinelProgress
        rank={10}
        points={1100}
        cutoffRank={10}
        cutoffPoints={1150}
      />
    </>
  );
};

export default SentinelRole;
