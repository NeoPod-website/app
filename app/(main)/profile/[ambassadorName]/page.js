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

  let ambassador = await getAmbassadorByUsername(ambassadorName);

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

        <WrapperContainer className="hidden flex-none space-y-6 p-2 lg:block lg:flex-1">
          {/* <div className="p-6">
            {isOwnProfile ? (
              <>
                <h2 className="mb-4 text-xl font-bold text-white">
                  Quick Actions
                </h2>
                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-400 bg-gradient-dark p-4">
                    <h3 className="mb-2 font-semibold text-white">
                      Invite Friends
                    </h3>
                    <p className="text-sm text-gray-400">
                      Share your invite code: {ambassador?.invite_code || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-400 bg-gradient-dark p-4">
                    <h3 className="mb-2 font-semibold text-white">
                      Pod Information
                    </h3>
                    <p className="text-sm text-gray-400">
                      Pod ID: {ambassador?.pod_id || "Not assigned"}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="mb-4 text-xl font-bold text-white">
                    Activity Streak
                  </h2>
                  <div className="rounded-lg border border-gray-400 bg-gradient-dark p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        Current Streak
                      </span>
                      <span className="text-2xl font-bold text-orange-400">
                        🔥
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="mb-1 text-3xl font-bold text-white">
                        {Math.floor(Math.random() * 30) + 1}
                      </div>
                      <div className="text-sm text-gray-400">days active</div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="mb-4 text-xl font-bold text-white">
                    Recent Achievements
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-lg border border-gray-400 bg-gradient-dark p-3">
                      <div className="text-2xl">🏆</div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          Top Performer
                        </div>
                        <div className="text-xs text-gray-400">
                          Completed 10+ quests this month
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border border-gray-400 bg-gradient-dark p-3">
                      <div className="text-2xl">🎯</div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          Quest Master
                        </div>
                        <div className="text-xs text-gray-400">
                          100% completion rate
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border border-gray-400 bg-gradient-dark p-3">
                      <div className="text-2xl">👥</div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          Community Builder
                        </div>
                        <div className="text-xs text-gray-400">
                          Invited 5+ ambassadors
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="mb-4 text-xl font-bold text-white">
                    Recent Activity
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-green-500"></div>
                      <div>
                        <div className="text-sm text-white">
                          Completed "DeFi Explorer" quest
                        </div>
                        <div className="text-xs text-gray-400">2 hours ago</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-500 mt-1 h-2 w-2 rounded-full"></div>
                      <div>
                        <div className="text-sm text-white">
                          Invited new ambassador
                        </div>
                        <div className="text-xs text-gray-400">1 day ago</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-purple-500"></div>
                      <div>
                        <div className="text-sm text-white">
                          Joined community discussion
                        </div>
                        <div className="text-xs text-gray-400">3 days ago</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-orange-500"></div>
                      <div>
                        <div className="text-sm text-white">
                          Updated profile information
                        </div>
                        <div className="text-xs text-gray-400">1 week ago</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="mb-4 text-xl font-bold text-white">Connect</h2>
                  <div className="space-y-3">
                    <button className="bg-blue-500/10 hover:bg-blue-500/20 w-full rounded-md border border-blue-500 px-4 py-3 text-sm text-blue-400 transition-all hover:border-blue-400">
                      <div className="flex items-center justify-center gap-2">
                        <span>💬</span>
                        <span>Send Message</span>
                      </div>
                    </button>

                    <button className="w-full rounded-md border border-green-500 bg-green-500/10 px-4 py-3 text-sm text-green-400 transition-all hover:border-green-400 hover:bg-green-500/20">
                      <div className="flex items-center justify-center gap-2">
                        <span>👥</span>
                        <span>View Pod Members</span>
                      </div>
                    </button>

                    <button className="w-full rounded-md border border-purple-500 bg-purple-500/10 px-4 py-3 text-sm text-purple-400 transition-all hover:border-purple-400 hover:bg-purple-500/20">
                      <div className="flex items-center justify-center gap-2">
                        <span>🤝</span>
                        <span>Collaborate</span>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div> */}
        </WrapperContainer>
      </div>
    </MainPageScroll>
  );
};

export default AmbassadorProfilePage;
