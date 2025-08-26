import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import MainPageScroll from "@/components/common/MainPageScroll";
import WrapperContainer from "@/components/common/WrapperContainer";

import { getCachedSession } from "@/lib/userSession";

import ProfileName from "@/components/layout/profile/ProfileName";
import ProfileInfo from "@/components/layout/profile/ProfileInfo";
import ProfileStats from "@/components/layout/profile/ProfileStats";
import ProfileHeader from "@/components/layout/profile/ProfileHeader";
import ProfileSocials from "@/components/layout/profile/ProfileSocials";
import ProfileRightSidebar from "@/components/layout/profile/ProfileRight";

// Function to fetch ambassador by username using your server-side pattern
async function getAmbassadorByUsername(username) {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  if (!token?.value) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/ambassadors?username=${encodeURIComponent(username)}`,
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
      notFound();
    }

    throw new Error(`Failed to fetch ambassador: ${response.status}`);
  }

  const { data } = await response.json();
  return data?.ambassador || null;
}

const fetchUserStats = async ({ ambassadorId, podId }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/leaderboards/my/stats?pod=${podId}&id=${ambassadorId}`,
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

  const { data } = await response.json();

  return data;
};

export async function generateMetadata({ params }) {
  const { ambassadorName } = await params;

  try {
    const ambassador = await getAmbassadorByUsername(ambassadorName);

    if (!ambassador) {
      return {
        title: "Ambassador Not Found | NeoPod",
        description: "The requested ambassador profile could not be found.",
      };
    }

    return {
      title: `${ambassador.username} | NeoPod Ambassador`,
      description: `View ${ambassador.username}'s ambassador profile, achievements, and activity within the NeoPod community.`,
    };
  } catch (error) {
    return {
      title: "Ambassador Profile | NeoPod",
      description:
        "View ambassador profile and achievements within the NeoPod community.",
    };
  }
}

const AmbassadorProfilePage = async ({ params }) => {
  const { ambassadorName } = await params;

  const session = await getCachedSession();
  const currentUser = session.user;

  const ambassador = await getAmbassadorByUsername(ambassadorName);
  const statsData = await fetchUserStats({
    ambassadorId: ambassador.ambassador_id,
    podId: ambassador.pod_id,
  });

  const isOwnProfile = currentUser?.username === ambassador.username;

  return (
    <MainPageScroll scrollable={false}>
      <div className="hide-scroll flex h-full flex-1 flex-col gap-6 overflow-y-auto lg:flex-row lg:overflow-y-hidden">
        <WrapperContainer
          scrollable={true}
          className="flex-none space-y-6 p-2 lg:flex-1"
        >
          <ProfileHeader user={ambassador} />

          <section className="thin-scrollbar space-y-7 overflow-y-auto px-4 2xl:px-6">
            <ProfileName user={ambassador} />
            <ProfileStats user={ambassador} />
            <ProfileSocials user={ambassador} />
            <ProfileInfo user={ambassador} />
          </section>
        </WrapperContainer>

        <WrapperContainer
          scrollable={true}
          className="flex-none space-y-6 p-2 md:p-4 lg:flex-1 lg:p-6 3xl:p-8"
        >
          <section className="hide-scroll lg:overflow-y-auto">
            <ProfileRightSidebar
              me={isOwnProfile}
              user={ambassador}
              stats={statsData.stats}
            />
          </section>
        </WrapperContainer>
      </div>
    </MainPageScroll>
  );
};

export default AmbassadorProfilePage;
