import React from "react";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { getCachedSession } from "@/lib/userSession";

import MainPageScroll from "@/components/common/MainPageScroll";

import RewardsWithFilter from "@/components/layout/rewards/RewardsWithFilter";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Rewards | Admin Panel | NeoPod",
  description:
    "View and manage token reward claims. Monitor claim status, track rewards distribution, and manage ambassador payouts.",
};

async function fetchRewards(limit) {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  let url = `${process.env.NEXT_PUBLIC_API_URL}/rewards?limit=${limit}&sortOrder=desc`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.value}`,
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }

    throw new Error(`Failed to fetch rewards: ${response.statusText}`);
  }

  const { data } = await response.json();

  return data;
}

const ManageRewardsPage = async () => {
  const rewardsData = await fetchRewards(20);

  const { user } = await getCachedSession();

  return (
    <MainPageScroll scrollable={false}>
      <Suspense>
        <RewardsWithFilter
          user={user}
          initialRewards={rewardsData.claims || []}
          initialPagination={rewardsData.pagination || {}}
          initialStatistics={rewardsData.statistics || {}}
        />
      </Suspense>
    </MainPageScroll>
  );
};

export default ManageRewardsPage;
