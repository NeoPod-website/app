"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button, Progress } from "@heroui/react";
import { EllipsisVerticalIcon } from "lucide-react";

const InitiateProgress = ({ points = 0 }) => {
  const [expanded, setExpanded] = useState(false);

  const progress = Math.min((points / 100) * 100, 100);

  const getMessage = () => {
    if (points >= 90) {
      return (
        <>
          <strong>So close!</strong> Just a little more effort and you'll be an
          Operator. You're doing great!
        </>
      );
    } else if (points >= 30) {
      return (
        <>
          <strong>Keep going!</strong> You're{" "}
          <span className="font-bold text-white">{points}</span> PODS closer to
          becoming an <span className="font-bold text-[#3BAEA1]">Operator</span>
          . Every contribution counts!
        </>
      );
    } else {
      return (
        <>
          <strong>Welcome!</strong> Start contributing to earn points and unlock
          the <span className="font-bold text-[#3BAEA1]">Operator role</span>.
          Let's get you to <strong>100 PODS</strong>!
        </>
      );
    }
  };

  return (
    <div className="border-t border-gray-400 p-3 text-gray-100">
      <div className="flex items-start gap-2.5">
        <Progress
          className="max-w-md"
          color="warning"
          formatOptions={{ style: "decimal", maximumFractionDigits: 0 }}
          label="Tier 1: Initiate"
          maxValue={100}
          valueLabel={`${points} / 100 pts`}
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
          onPress={() => setExpanded((prev) => !prev)}
          className="h-5 w-5 min-w-0 bg-transparent p-0 hover:bg-gray-700"
        >
          <EllipsisVerticalIcon size={16} />
        </Button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-1.5 text-sm">
          <p>{getMessage()}</p>

          <p>
            <span>Current Points:</span>{" "}
            <strong className="text-white">{points} PODS</strong>
          </p>

          {points < 100 && (
            <p className="text-red-500">
              <strong>{100 - points}</strong> more PODS to become an{" "}
              <span className="font-bold text-[#3BAEA1]">Operator.</span>
            </p>
          )}

          <Link
            href="/guide/how-to-earn"
            className="mt-1 inline-block text-white underline"
          >
            How to Earn PODS
          </Link>
        </div>
      )}
    </div>
  );
};

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

      {expanded && (
        <div className="mt-4 space-y-1.5 text-sm">
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
      )}
    </div>
  );
};

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
      return "You're a valued Sentinel! Your expertise is recognized.";
    } else if (nearCutoff) {
      return `Heads up! You're getting close to the bottom 10. Maintain your activity to stay in Sentinel tier.`;
    } else {
      return `You're currently in the bottom 10. Earn ${
        cutoffPoints - points
      } more points to move up. Let's get back on track!`;
    }
  };

  return (
    <div className="max-w-md border-t border-gray-400 p-4 text-gray-100">
      <div className="flex items-start gap-2.5">
        <div className="flex-1">
          <p className="text-sm font-medium text-yellow-300">
            Tier 3: Sentinel
          </p>
          <p className="text-sm">{getStatusMessage()}</p>
        </div>

        <Button
          onPress={() => setExpanded((prev) => !prev)}
          className="h-5 w-5 min-w-0 bg-transparent p-0 hover:bg-gray-700"
        >
          <EllipsisVerticalIcon size={16} />
        </Button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-1.5 text-sm">
          <p>
            <span className="font-bold text-white">Rank:</span> #{rank}
          </p>
          <p>
            <span className="font-bold text-white">Points:</span> {points} pts
          </p>
          <p>
            <span className="font-bold text-white">Cutoff Rank:</span> #
            {cutoffRank} ({cutoffPoints} pts)
          </p>

          {isInBottom10 && (
            <p className="text-red-500">
              Need {cutoffPoints - points} more points to escape the bottom 10.
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

export { InitiateProgress, OperatorProgress, SentinelProgress };
