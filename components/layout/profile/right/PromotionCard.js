import React from "react";
import Image from "next/image";
import { TrendingUp } from "lucide-react";

import RequestPromotionBtn from "../../../ui/buttons/profile/RequestPromotionBtn";

const PromotionCard = ({ user, stats }) => {
  const currentRole = user?.role_type || "initiate";

  const getPromotionData = () => {
    const totalPoints = user?.total_points || 0;
    const previousMonthRank = stats?.previous_month?.role_specific?.rank;

    switch (currentRole) {
      case "initiate":
        const initiateCanPromote = totalPoints >= 100;

        return {
          canPromote: initiateCanPromote,
          canRequest: true,
          nextRole: "operator",
          requirement: "100 total points",
          nextRoleIcon: "/ambassadors/operator.png",
          nextRoleColor: "text-blue-400",
          bgColor: "border-blue-500/30 bg-blue-500/10",
          message: initiateCanPromote
            ? "Requirements met! You're ready to advance to Operator status."
            : `You need ${100 - totalPoints} more points to unlock Operator promotion.`,
        };

      case "operator":
        const operatorCanPromote = previousMonthRank && previousMonthRank <= 10;
        return {
          canPromote: operatorCanPromote,
          canRequest: true,
          nextRole: "sentinel",
          requirement: "Top 10 previous month ranking",
          nextRoleIcon: "/ambassadors/sentinel.png",
          nextRoleColor: "text-purple-400",
          bgColor: "border-purple-500/30 bg-purple-500/10",
          message: operatorCanPromote
            ? "Outstanding performance! Your top 10 ranking qualifies you for Sentinel advancement."
            : previousMonthRank
              ? `Previous month rank: #${previousMonthRank}. Reach top 10 to unlock Sentinel promotion.`
              : "Build consistent monthly rankings to unlock Sentinel tier advancement.",
        };

      case "sentinel":
        return {
          canPromote: false,
          canRequest: false,
          nextRole: "architect",
          requirement: "Admin discretion & exceptional contributions",
          nextRoleIcon: "/ambassadors/architect.png",
          nextRoleColor: "text-yellow-400",
          bgColor: "border-yellow-500/30 bg-yellow-500/10",
          message:
            "Architect tier is reserved for exceptional long-term contributors who demonstrate outstanding leadership, innovation, and community impact. Promotions are carefully reviewed by administrators.",
        };

      case "architect":
        return {
          canPromote: false,
          canRequest: false,
          nextRole: null,
          requirement: "Maximum tier achieved",
          nextRoleIcon: "/ambassadors/architect.png",
          nextRoleColor: "text-yellow-400",
          bgColor: "border-yellow-500/30 bg-yellow-500/10",
          message:
            "You've reached the pinnacle of ambassador excellence! Continue inspiring others and shaping the future of our community through your exceptional contributions.",
        };

      default:
        return null;
    }
  };

  const promotionData = getPromotionData();

  if (!promotionData) return null;

  const {
    canPromote,
    canRequest,
    nextRole,
    requirement,
    nextRoleIcon: NextRoleIcon,
    nextRoleColor,
    bgColor,
    message,
  } = promotionData;

  return (
    <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
      <div className="mb-4 flex items-center gap-3">
        <TrendingUp className="h-5 w-5 text-green-500" />

        <h3 className="font-semibold text-white">
          {nextRole ? "Tier Advancement" : "Elite Status"}
        </h3>
      </div>

      <div className={`rounded-lg border p-4 ${bgColor}`}>
        {nextRole && (
          <div className="mb-2 flex items-center gap-2">
            <Image
              width={20}
              height={20}
              src={NextRoleIcon}
              alt={`${nextRole} icon`}
              className={`h-5 w-5 ${nextRoleColor}`}
            />

            <span className={`font-medium ${nextRoleColor}`}>
              {nextRole === null
                ? "Maximum Tier"
                : `Next: ${nextRole.charAt(0).toUpperCase() + nextRole.slice(1)}`}
            </span>
          </div>
        )}

        <p className="mb-3 text-xs text-gray-100">
          {nextRole ? `Requirement: ${requirement}` : requirement}
        </p>

        <p className="mb-4 text-sm text-gray-200">{message}</p>

        {canRequest && canPromote ? (
          <RequestPromotionBtn nextRole={nextRole} />
        ) : canRequest && !canPromote ? (
          <div className="py-2 text-center text-xs text-gray-300">
            Continue contributing to unlock promotion
          </div>
        ) : (
          <div className="rounded bg-gray-700/50 py-2 text-center text-xs text-gray-300">
            {currentRole === "architect"
              ? "Maximum tier achieved"
              : "Admin-only promotion"}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionCard;
