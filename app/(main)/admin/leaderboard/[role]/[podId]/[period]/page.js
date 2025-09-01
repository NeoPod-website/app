import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import WrapperContainer from "@/components/common/WrapperContainer";
import AdminLeaderboardContainer from "@/components/layout/leaderboard/admin/AdminLeaderboardContainer";

export const metadata = {
  title: "Pod Leaderboard | NeoPod Admin",
  description:
    "View detailed leaderboard for the selected pod. Monitor ambassador performance and rankings.",
};

const fetchAdminLeaderboardData = async (
  podId,
  role,
  limit = 10,
  lastKey = null,
  period,
) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  if (!token?.value) {
    throw new Error("Authentication token not found");
  }

  const query = new URLSearchParams({
    limit: limit.toString(),
  });

  // Set period and role_type based on route
  if (role === "all-time") {
    query.append("period", "all_time");
  } else {
    // For specific roles, use current month in YYYY_MM format
    query.append("period", period);
    query.append("role_type", role);
  }

  if (lastKey) {
    query.append("last_key", lastKey);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/leaderboards/admin/pod/${podId}?${query.toString()}`,
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
        period: role === "all-time" ? "all_time" : "current_month",
        ambassadors: [],
        totalEntries: 0,
        pagination: { hasMore: false, lastKey: null },
      };
    }

    throw new Error(`Failed to fetch leaderboard: ${response.status}`);
  }

  const { data } = await response.json();

  return {
    period: data.period || (role === "all-time" ? "all_time" : "current_month"),
    ambassadors: data.leaderboard || [],
    totalEntries: data.total_entries || 0,
    pagination: {
      hasMore: data.has_more || false,
      lastKey: data.last_key || null,
    },
  };
};

const fetchPodInfo = async (podId) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  if (!token?.value) {
    return null;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/pods/${podId}`,
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
    return data.pod || null;
  } catch (error) {
    console.error("Error fetching pod info:", error);
    return null;
  }
};

const AdminPodLeaderboardPage = async ({ params }) => {
  const { podId, role, period } = await params;

  // Validate that we have podId
  if (!podId) {
    notFound();
  }

  // Validate role parameter
  const validRoles = [
    "initiate",
    "operator",
    "sentinel",
    "architect",
    "all-time",
  ];

  if (!validRoles.includes(role)) {
    notFound();
  }

  // Fetch initial leaderboard data and pod info in parallel
  const [leaderboardData, podInfo] = await Promise.all([
    fetchAdminLeaderboardData(podId, role, 10, null, period),
    fetchPodInfo(podId),
  ]);

  // Get stats from first ambassador
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

  const podLanguage = podInfo?.language || "Unknown";
  const podName = podInfo?.name || `Pod ${podId}`;

  // Safe handling of podId for display
  const podIdDisplay = podId ? podId.slice(-6).toUpperCase() : "UNKNOWN";

  // Format role for display
  const roleDisplay =
    role === "all-time"
      ? "All-Time"
      : role.charAt(0).toUpperCase() + role.slice(1);

  const periodDisplay =
    role === "all-time"
      ? "All-Time Rankings"
      : `Current Month • ${roleDisplay} Role`;

  return (
    <WrapperContainer scrollable={true} className="p-6 3xl:p-10">
      <div className="mb-4 lg:mb-6 3xl:mb-8">
        <h1 className="mb-2 text-xl font-bold text-gray-100 md:text-3xl 3xl:text-2xl">
          {roleDisplay} Leaderboard
        </h1>

        <p className="text-sm text-gray-300 3xl:text-base">
          {podName} ({podLanguage}) • {periodDisplay}
        </p>
      </div>

      <div className="mb-3 rounded-2xl border border-gray-600/30 bg-gray-700/30 p-4 lg:mb-4 3xl:mb-6 3xl:p-6">
        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          <div>
            <div className="text-xl font-bold text-gray-100 3xl:text-2xl">
              {totalAmbassadors}
            </div>

            <div className="text-xs text-gray-400 3xl:text-sm">
              {role === "all-time"
                ? "Total Ambassadors"
                : `${roleDisplay} Ambassadors`}
            </div>
          </div>

          <div>
            <div className="text-xl font-bold text-gray-100 3xl:text-2xl">
              {topScore.toLocaleString()}
            </div>

            <div className="text-xs text-gray-400 3xl:text-sm">Top Score</div>
          </div>

          <div>
            <div className="text-xl font-bold text-gray-100 3xl:text-2xl">
              {totalQuests}
            </div>

            <div className="text-xs text-gray-400 3xl:text-sm">
              Total Quests
            </div>
          </div>

          <div>
            <div className="text-xl font-bold text-gray-100 3xl:text-2xl">
              {podIdDisplay}
            </div>

            <div className="text-xs text-gray-400 3xl:text-sm">Pod ID</div>
          </div>
        </div>
      </div>

      <section className="thin-scrollbar flex flex-1 flex-col overflow-y-auto">
        <AdminLeaderboardContainer
          role={role}
          podId={podId}
          period={period}
          initialData={leaderboardData.ambassadors}
          initialLastKey={leaderboardData.pagination.lastKey}
          initialHasMore={leaderboardData.pagination.hasMore}
        />
      </section>
    </WrapperContainer>
  );
};

export default AdminPodLeaderboardPage;
