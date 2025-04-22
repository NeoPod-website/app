"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Button, Progress } from "@heroui/react";
import { EllipsisVerticalIcon } from "lucide-react";

import SidebarProfile from "../SidebarProfile";

import MainModal from "@/components/ui/modals/MainModal";

const InitiateProgress = ({
  rank = 40,
  points = 0,
  percentileRank, // Optional
}) => {
  const [expanded, setExpanded] = useState(false);

  const progress = Math.min((points / 100) * 100, 100);

  const getMessage = () => {
    if (points >= 90) {
      return (
        <>
          <strong className="text-white">So close!</strong> Just a little more
          effort and you'll be an{" "}
          <span className="font-semibold text-[#3BAEA1]">Operator</span>. You're
          doing great!
        </>
      );
    } else if (points >= 30) {
      return (
        <>
          <strong className="text-white">Keep going!</strong> You're{" "}
          <span className="font-bold text-white">{points}</span> PODS in — just{" "}
          <span className="font-bold text-yellow-300">{100 - points} more</span>{" "}
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

  return (
    <>
      <div className="border-t border-gray-400 p-3 text-gray-100">
        <div className="flex items-start gap-2.5">
          <Progress
            className="max-w-md"
            color="warning"
            formatOptions={{ style: "decimal", maximumFractionDigits: 0 }}
            label="Tier 1: Initiate"
            maxValue={100}
            valueLabel={`${points} / 100 PODS`}
            showValueLabel={true}
            size="md"
            value={progress}
            classNames={{
              indicator: "bg-gradient-rank-initiate",
              label: "text-gray-100 text-sm",
              value: "text-gray-100 text-sm",
            }}
          />

          <Button
            onPress={() => setExpanded(true)}
            className="h-5 w-5 min-w-0 bg-transparent p-0 hover:bg-gray-700"
          >
            <EllipsisVerticalIcon size={16} />
          </Button>
        </div>
      </div>

      <MainModal
        title="Tier 1: Initiate Progress"
        description="Track your progress and learn how to reach the next tier"
        isOpen={expanded}
        handleOnClose={() => setExpanded(false)}
        size="lg"
      >
        <div className="space-y-3 text-sm text-gray-100">
          <p>{getMessage()}</p>

          <p>
            <span>Current Rank:</span>{" "}
            <strong className="text-white">#{rank}</strong>
          </p>

          <p>
            <span>Current Points:</span>{" "}
            <strong className="text-white">{points} PODS</strong>
          </p>

          {points < 100 && (
            <p className="text-red-500">
              {100 - points} more PODS to become an{" "}
              <span className="font-semibold text-[#3BAEA1]">Operator</span>.
            </p>
          )}

          {typeof percentileRank === "number" && (
            <p>
              You’re currently in the{" "}
              <span className="font-semibold text-blue-400">
                top {100 - percentileRank}%
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
        </div>
      </MainModal>
    </>
  );
};

const InitiateProfileImage = () => (
  <Image
    width={28}
    height={20}
    alt="Initiate Rank"
    src="/dashboard/profile/initiate-star.png"
    className="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2"
  />
);

const InitiateRole = () => {
  return (
    <>
      <SidebarProfile>
        <InitiateProfileImage />
      </SidebarProfile>

      <InitiateProgress points={50} rank={40} percentileRank={60} />
    </>
  );
};

export default InitiateRole;
