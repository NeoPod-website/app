import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import MainPageScroll from "@/components/common/MainPageScroll";
import WrapperContainer from "@/components/common/WrapperContainer";

import ProfileName from "@/components/layout/profile/ProfileName";
import ProfileInfo from "@/components/layout/profile/ProfileInfo";
import ProfileStats from "@/components/layout/profile/ProfileStats";
import ProfileHeader from "@/components/layout/profile/ProfileHeader";
import ProfileSocials from "@/components/layout/profile/ProfileSocials";

import ProfileRightSidebar from "@/components/layout/profile/ProfileRight";

export const metadata = {
  title: "Profile | NeoPod",
  description:
    "View and manage your ambassador profile. Update your personal information, track your achievements, and review your activity within the NeoPod community.",
};

const fetchWithAuth = async (endpoint) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
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

  // For auth errors, return null instead of throwing
  if (response.status === 401 || response.status === 403) {
    throw new Error("Unauthorized");
  }

  // For 404s on user data, return null (user might not exist)
  if (response.status === 404) {
    return notFound();
  }

  // Let other HTTP errors bubble up to error.js
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();

  return result.data || result;
};

const fetchUserData = async () => {
  const data = await fetchWithAuth("/ambassadors/profile/me");
  return data.user;
};

const fetchUserStats = async () => {
  const data = await fetchWithAuth("/leaderboards/my/stats");
  return data.stats;
};

const ProfilePage = async () => {
  const [user, userStats] = await Promise.allSettled([
    fetchUserData(),
    fetchUserStats(),
  ]);

  const userData = user.status === "fulfilled" ? user.value : null;
  const statsData = userStats.status === "fulfilled" ? userStats.value : null;

  return (
    <MainPageScroll scrollable={false}>
      <div className="hide-scroll flex h-full flex-1 flex-col gap-2 overflow-y-auto lg:flex-row lg:overflow-y-hidden">
        <WrapperContainer
          scrollable={true}
          className="flex-none space-y-6 p-2 lg:flex-1"
        >
          <ProfileHeader user={userData} />

          <section className="thin-scrollbar space-y-7 px-4 lg:overflow-y-auto 2xl:px-6">
            <ProfileName user={userData} />
            <ProfileStats user={userData} />
            <ProfileSocials user={userData} />
            <ProfileInfo user={userData} />
          </section>
        </WrapperContainer>

        <WrapperContainer
          scrollable={true}
          className="flex-none space-y-6 p-2 md:p-4 lg:flex-1 lg:p-6 3xl:p-8"
        >
          <section className="hide-scroll lg:overflow-y-auto">
            <ProfileRightSidebar user={userData} stats={statsData} me={true} />
          </section>
        </WrapperContainer>
      </div>
    </MainPageScroll>
  );
};

export default ProfilePage;
