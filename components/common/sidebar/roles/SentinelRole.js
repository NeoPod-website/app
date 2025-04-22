"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";
import React, { useState } from "react";
import { EllipsisVerticalIcon } from "lucide-react";

const SentinelProgress = ({
  rank,
  points,
  cutoffRank = 10,
  cutoffPoints = 1150,
}) => {
  const [expanded, setExpanded] = useState(false);

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
            {" "}
            <span className="text-yellow-500">Sentinel</span> status
          </strong>
          . You’ve got this!
        </>
      );
    }
  };

  return (
    <div className="max-w-md border-t border-gray-400 p-4 text-gray-100">
      <div className="flex items-start gap-2.5">
        <div className="flex-1">
          <p className="text-sm font-semibold text-yellow-300">
            Tier 3: Sentinel
          </p>
          <p className="mt-1 text-sm">{getStatusMessage()}</p>
        </div>

        <Button
          onPress={() => setExpanded((prev) => !prev)}
          className="h-5 w-5 min-w-0 bg-transparent p-0 hover:bg-gray-700"
        >
          <EllipsisVerticalIcon size={16} />
        </Button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-2 text-sm">
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
      )}
    </div>
  );
};

const SentinelProfileImage = () => (
  <Image
    width={36}
    height={20}
    alt="Sentinel Rank"
    src="/dashboard/profile/sentinel-star.png"
    className="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2"
  />
);

const SentinelRole = () => {
  return (
    <>
      <div className="px-3 py-2">
        <div className="relative w-fit">
          <Image
            src="/dashboard/profile/default-profile.png"
            width={48}
            height={48}
            alt="Profile Photo"
            className="rounded-md"
          />

          <SentinelProfileImage />
        </div>
      </div>

      <SentinelProgress
        rank={12}
        points={780}
        cutoffRank={10}
        cutoffPoints={1150}
      />
    </>
  );
};

export default SentinelRole;
