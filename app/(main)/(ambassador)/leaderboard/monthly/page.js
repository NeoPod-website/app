import React from "react";
import { cookies } from "next/headers";

import WrapperContainer from "@/components/common/WrapperContainer";
import LeaderboardContainer from "@/components/layout/leaderboard/LeaderboardContainer";

export const metadata = {
  title: "Monthly Leaderboard | NeoPod",
  description:
    "Check the top performers for the current month. See how your achievements compare to other ambassadors and climb the leaderboard.",
};

const fetchLeaderboardData = async (limit = 10, lastKey = null) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  if (!token?.value) {
    throw new Error("Authentication token not found");
  }

  const query = new URLSearchParams({
    limit: limit.toString(),
  });

  if (lastKey) {
    query.append("last_key", lastKey);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/leaderboards?${query.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      credentials: "include",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      return {
        period: "2025-07",
        ambassadors: [],
        totalEntries: 0,
        pagination: { hasMore: false, lastKey: null },
      };
    }

    throw new Error(`Failed to fetch leaderboard: ${response.status}`);
  }

  const { data } = await response.json();

  return {
    period: data.period,
    ambassadors: data.leaderboard || [],
    totalEntries: data.total_entries || 0,
    pagination: {
      hasMore: data.has_more || false,
      lastKey: data.last_key || null,
    },
  };
};

const fetchUserRank = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  if (!token?.value) {
    return null;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/leaderboards/rank`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      credentials: "include",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  const { data } = await response.json();
  return data.ambassador_rank || null;
};

const MonthlyLeaderboardPage = async () => {
  // Fetch initial leaderboard data and user rank in parallel
  const [leaderboardData, userRank] = await Promise.all([
    fetchLeaderboardData(10),
    fetchUserRank(),
  ]);

  // Get stats from first ambassador (they all have total_ambassadors_in_category)
  const totalAmbassadors =
    leaderboardData.ambassadors.length > 0
      ? leaderboardData.ambassadors[0].total_ambassadors_in_category ||
        leaderboardData.totalEntries
      : leaderboardData.totalEntries;

  const topScore =
    leaderboardData.ambassadors.length > 0
      ? leaderboardData.ambassadors[0].points
      : 0;

  const totalQuests = leaderboardData.ambassadors.reduce(
    (total, amb) => total + (amb.quest_count || 0),
    0,
  );

  return (
    <WrapperContainer scrollable={true} className="p-6 3xl:p-10">
      <div className="mb-4 lg:mb-6 3xl:mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-100 3xl:text-3xl">
          Monthly Leaderboard
        </h1>

        <p className="text-sm text-gray-300 3xl:text-base">
          {leaderboardData.period} • Monthly Rankings
        </p>
      </div>

      <div className="mb-3 rounded-2xl border border-gray-600/30 bg-gray-700/30 p-4 lg:mb-4 3xl:mb-6 3xl:p-6">
        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          <div>
            <div className="text-xl font-bold text-gray-100 3xl:text-2xl">
              {totalAmbassadors}
            </div>

            <div className="text-xs text-gray-200 3xl:text-sm">
              Total Ambassadors
            </div>
          </div>

          <div>
            <div className="text-xl font-bold text-gray-100 3xl:text-2xl">
              {topScore.toLocaleString()}
            </div>

            <div className="text-xs text-gray-200 3xl:text-sm">Top Score</div>
          </div>

          <div>
            <div className="text-xl font-bold text-gray-100 3xl:text-2xl">
              {totalQuests}
            </div>

            <div className="text-xs text-gray-200 3xl:text-sm">
              Total Quests
            </div>
          </div>

          <div>
            <div className="text-xl font-bold text-gray-100 3xl:text-2xl">
              {userRank?.rank || "N/A"}
            </div>

            <div className="text-xs text-gray-200 3xl:text-sm">Your Rank</div>
          </div>
        </div>
      </div>

      <section className="thin-scrollbar flex flex-1 flex-col overflow-y-auto">
        <LeaderboardContainer
          userRank={userRank}
          leaderboardType="monthly"
          initialData={leaderboardData.ambassadors}
          initialLastKey={leaderboardData.pagination.lastKey}
          initialHasMore={leaderboardData.pagination.hasMore}
        />
      </section>
    </WrapperContainer>
  );
};

export default MonthlyLeaderboardPage;
