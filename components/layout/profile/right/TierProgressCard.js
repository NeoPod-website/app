import React from "react";
import Image from "next/image";

const TierProgressCard = ({ user, stats }) => {
  const currentRole = user?.role_type || "initiate";

  const getRoleProgression = () => {
    const totalPoints = user?.total_points || 0;

    const currentMonthRank = stats?.current_month?.role_specific?.rank;
    const previousMonthRank = stats?.previous_month?.role_specific?.rank;

    switch (currentRole) {
      case "initiate":
        return {
          progress: Math.min((totalPoints / 100) * 100, 100),
          progressText: `${totalPoints} / 100`,
          message:
            totalPoints >= 90
              ? `Keep going! You're ${totalPoints} points closer to becoming an Operator. Every contribution counts!`
              : totalPoints >= 30
                ? `Keep going! You have ${totalPoints} points - just ${100 - totalPoints} more to reach Operator.`
                : "Keep going! You're 100 points closer to becoming an Operator. Every contribution counts!",
        };

      case "operator":
        let rankProgress = 0;
        let progressText = "No rank yet";

        if (currentMonthRank) {
          if (currentMonthRank <= 10) {
            rankProgress = 100;
            progressText = `Top 10 (Rank #${currentMonthRank})`;
          } else {
            const distanceFromTop10 = currentMonthRank - 10;
            const maxDistance = 40;
            rankProgress = Math.max(
              0,
              100 - (distanceFromTop10 / maxDistance) * 100,
            );
            progressText = `Rank #${currentMonthRank} (Need top 10)`;
          }
        }

        return {
          progress: rankProgress,
          progressText,
          message:
            previousMonthRank && previousMonthRank <= 10
              ? "Top performance! You achieved top 10 last month and earned Sentinel eligibility."
              : previousMonthRank
                ? `Previous month rank: #${previousMonthRank}. Reach top 10 monthly ranking for Sentinel promotion.`
                : "Build consistent monthly performance to unlock Sentinel tier advancement.",
        };

      case "sentinel":
        return {
          progress: 100,
          progressText: "Elite tier",
          message:
            "Elite tier achieved! Continue demonstrating exceptional leadership and community impact for potential Architect consideration.",
        };

      default:
        return {
          progress: 100,
          progressText: "Max tier",
          message:
            "You've reached the highest tier. Continue your exceptional contributions and inspire the next generation of ambassadors!",
        };
    }
  };

  const getRoleConfig = (role) => {
    const configs = {
      initiate: {
        color: "text-gray-400",
        icon: "/ambassadors/initiate.png",
        tierColor: "bg-gradient-rank-initiate",
      },
      operator: {
        color: "text-blue-400",
        icon: "/ambassadors/operator.png",
        tierColor: "bg-gradient-rank-operator",
      },
      sentinel: {
        color: "text-purple-400",
        icon: "/ambassadors/sentinel.png",
        tierColor: "bg-gradient-rank-sentinel",
      },
      architect: {
        color: "text-yellow-400",
        icon: "/ambassadors/architect.png",
        tierColor: "bg-gradient-rank-architect",
      },
    };
    return configs[role] || configs.initiate;
  };

  const getTierNumber = (role) => {
    const tierMap = {
      initiate: "1",
      operator: "2",
      sentinel: "3",
      architect: "4",
    };
    return tierMap[role] || "1";
  };

  const roleProgression = getRoleProgression();
  const roleConfig = getRoleConfig(currentRole);

  const RoleIcon = roleConfig.icon;

  return (
    <div className="rounded-xl border border-gray-400 bg-gradient-dark p-6">
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-slate-600">
            <Image
              width={48}
              height={48}
              src={RoleIcon}
              alt={`${currentRole} icon`}
              className={`h-12 w-12 ${roleConfig.color}`}
            />
          </div>

          <div className="absolute -bottom-1 -right-1 rounded-full bg-black p-1">
            <div
              className={`h-6 w-6 rounded-full ${roleConfig.tierColor} flex items-center justify-center`}
            >
              <span className="text-xs font-bold text-white">
                {getTierNumber(currentRole)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="mb-1 text-lg font-bold text-white">
            Tier {getTierNumber(currentRole)}:{" "}
            {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
          </h3>

          <div className="mb-2 flex items-center justify-between text-sm text-gray-200">
            <span>Progress</span>
            <span>{roleProgression.progressText}</span>
          </div>

          <div className="mb-3 h-2 w-full rounded-full bg-gray-700">
            <div
              className={`h-2 rounded-full ${roleConfig.tierColor} transition-all duration-300`}
              style={{ width: `${roleProgression.progress}%` }}
            />
          </div>

          <p className="text-sm text-gray-300">{roleProgression.message}</p>
        </div>
      </div>
    </div>
  );
};

export default TierProgressCard;
