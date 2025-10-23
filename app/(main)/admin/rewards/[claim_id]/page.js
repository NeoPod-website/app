import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { getCachedSession } from "@/lib/userSession";

import MainPageScroll from "@/components/common/MainPageScroll";
import WrapperContainer from "@/components/common/WrapperContainer";
import RewardDetails from "@/components/layout/rewards/RewardDetails";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { claim_id } = await params;

  return {
    title: `Reward ${claim_id.slice(0, 8)} | Admin Panel | NeoPod`,
    description: "View detailed information about a token reward claim.",
  };
}

async function fetchRewardDetails(claimId) {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  if (!token?.value) {
    throw new Error("Authentication token not found");
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/rewards/claim/${claimId}`;

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
    throw new Error(`Failed to fetch reward details: ${response.statusText}`);
  }

  const { data } = await response.json();

  return data;
}

const RewardDetailsPage = async ({ params }) => {
  try {
    const { user } = await getCachedSession();

    const { claim_id } = await params;
    const rewardData = await fetchRewardDetails(claim_id);

    return (
      <MainPageScroll scrollable={false}>
        <WrapperContainer scrollable className="p-6">
          <RewardDetails user={user} reward={rewardData} />
        </WrapperContainer>
      </MainPageScroll>
    );
  } catch (error) {
    console.error("Error loading reward details:", error);
    throw error;
  }
};

export default RewardDetailsPage;
