import React from "react";
import { cookies } from "next/headers";

import WrapperContainer from "@/components/common/WrapperContainer";
import LeaderboardContainer from "@/components/layout/leaderboard/LeaderboardContainer";
import { getServerSession } from "@/lib/authorizeUser";

export const metadata = {
  title: "Monthly Leaderboard | NeoPod",
  description:
    "Check the top performers for the current month. See how your achievements compare to other ambassadors and climb the leaderboard.",
};

// Dummy leaderboard data - this will be fetched from your backend
const dummyLeaderboardData = [
  {
    rank: 1,
    ambassador_id: "amb_001",
    username: "CryptoMaster",
    email: "crypto@example.com",
    wallet_address: "0x742d35Cc6634C0532925a3b8D6Ff5E8540000000",
    role_type: "architect",
    points: 2847,
    rank_change: 2,
    profile_photo: "https://i.pravatar.cc/150?u=cryptomaster",
    quest_count: 23,
    last_activity: "2025-07-18T10:30:00Z",
  },
  {
    rank: 2,
    ambassador_id: "amb_002",
    username: "BlockchainNinja",
    email: null,
    wallet_address: "0x8ba1f109551bD432803012645Hac136c5c8000000",
    role_type: "sentinel",
    points: 2634,
    rank_change: -1,
    profile_photo: "https://i.pravatar.cc/150?u=blockchainninja",
    quest_count: 21,
    last_activity: "2025-07-17T15:45:00Z",
  },
  {
    rank: 3,
    ambassador_id: "amb_003",
    username: "DefiExplorer",
    email: "defi@example.com",
    wallet_address: null,
    role_type: "operator",
    points: 2401,
    rank_change: 1,
    profile_photo: "https://i.pravatar.cc/150?u=defiexplorer",
    quest_count: 19,
    last_activity: "2025-07-19T09:15:00Z",
  },
  {
    rank: 4,
    ambassador_id: "amb_004",
    username: "Web3Pioneer",
    email: "pioneer@example.com",
    wallet_address: "0x742d35Cc6634C0532925a3b8D6Ff5E8540000001",
    role_type: "initiate",
    points: 2156,
    rank_change: 0,
    profile_photo: "https://i.pravatar.cc/150?u=web3pioneer",
    quest_count: 17,
    last_activity: "2025-07-18T14:20:00Z",
  },
  {
    rank: 5,
    ambassador_id: "amb_005",
    username: "TokenTrader",
    email: null,
    wallet_address: "0x8ba1f109551bD432803012645Hac136c5c8000001",
    role_type: "operator",
    points: 1987,
    rank_change: -2,
    profile_photo: "https://i.pravatar.cc/150?u=tokentrader",
    quest_count: 15,
    last_activity: "2025-07-16T11:30:00Z",
  },
  {
    rank: 6,
    ambassador_id: "amb_006",
    username: "SmartContractDev",
    email: "dev@example.com",
    wallet_address: null,
    role_type: "architect",
    points: 1834,
    rank_change: 1,
    profile_photo: "https://i.pravatar.cc/150?u=smartcontractdev",
    quest_count: 14,
    last_activity: "2025-07-17T16:45:00Z",
  },
];

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
      return { history: [], pagination: { hasMore: false, lastKey: null } };
    }

    throw new Error(`Failed to fetch history: ${response.status}`);
  }

  const { data } = await response.json();

  return {
    period: data.period,
    ambassadors: data.leaderboard,
    totalEntries: data.total_entries,
    pagination: {
      hasMore: data.has_more,
      lastKey: data.last_key,
    },
  };
};

const MonthlyLeaderboardPage = async () => {
  const { user } = await getServerSession();

  // Fetch initial leaderboard data on server
  const leaderboardData = await fetchLeaderboardData(2);

  // TODO: Get current user's ambassador ID from auth/session
  const currentAmbassadorId = user?.ambassador_id;

  // Calculate stats
  const totalAmbassadors = leaderboardData.ambassadors.length;
  const topScore =
    leaderboardData.ambassadors.length > 0
      ? leaderboardData.ambassadors[0].points
      : 0;
  const totalQuests = leaderboardData.ambassadors.reduce(
    (total, amb) => total + amb.quest_count,
    0,
  );

  return (
    <WrapperContainer scrollable={true} className="p-6 3xl:p-10">
      <div className="mb-6 md:mb-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-100 md:text-3xl">
          Monthly Leaderboard
        </h1>
        <p className="text-sm text-gray-300 md:text-base">
          {leaderboardData.period} • Monthly Rankings
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-600/30 bg-gray-700/30 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          <div>
            <div className="text-xl font-bold text-gray-100 md:text-2xl">
              {totalAmbassadors}
            </div>
            <div className="text-xs text-gray-400 md:text-sm">
              Current Ambassadors
            </div>
          </div>

          <div>
            <div className="text-xl font-bold text-gray-100 md:text-2xl">
              {topScore.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 md:text-sm">Top Score</div>
          </div>

          <div>
            <div className="text-xl font-bold text-gray-100 md:text-2xl">
              {totalQuests}
            </div>
            <div className="text-xs text-gray-400 md:text-sm">Total Quests</div>
          </div>

          <div>
            <div className="text-xl font-bold text-gray-100 md:text-2xl">
              July
            </div>
            <div className="text-xs text-gray-400 md:text-sm">
              Current Period
            </div>
          </div>
        </div>
      </div>

      <section className="thin-scrollbar flex flex-1 flex-col overflow-y-auto">
        <LeaderboardContainer
          leaderboardType="monthly"
          currentAmbassadorId={currentAmbassadorId}
          initialData={leaderboardData.ambassadors}
          initialLastKey={leaderboardData.pagination.lastKey}
          initialHasMore={leaderboardData.pagination.hasMore}
        />
      </section>
    </WrapperContainer>
  );
};

export default MonthlyLeaderboardPage;
