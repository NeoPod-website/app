import React from "react";

import MainPageScroll from "@/components/common/MainPageScroll";
import WrapperContainer from "@/components/common/WrapperContainer";

import { getCachedSession } from "@/lib/userSession";

import ProfileName from "@/components/layout/profile/ProfileName";
import ProfileInfo from "@/components/layout/profile/ProfileInfo";
import ProfileStats from "@/components/layout/profile/ProfileStats";
import ProfileHeader from "@/components/layout/profile/ProfileHeader";
import ProfileSocials from "@/components/layout/profile/ProfileSocials";

export const metadata = {
  title: "Profile | NeoPod",
  description:
    "View and manage your ambassador profile. Update your personal information, track your achievements, and review your activity within the NeoPod community.",
};

const ProfilePage = async () => {
  const { user } = await getCachedSession();

  return (
    <MainPageScroll scrollable={false}>
      <div className="flex h-full flex-1 gap-6 overflow-hidden">
        <WrapperContainer scrollable={true} className="space-y-6 p-2">
          <ProfileHeader user={user} />

          <section className="thin-scrollbar space-y-7 overflow-y-auto px-4 2xl:px-6">
            <ProfileName user={user} />
            <ProfileStats user={user} />
            <ProfileSocials user={user} />
            <ProfileInfo user={user} />
          </section>
        </WrapperContainer>

        <WrapperContainer>
          <div className="p-6">
            <h2 className="mb-4 text-xl font-bold text-white">Quick Actions</h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-400 bg-gradient-dark p-4">
                <h3 className="mb-2 font-semibold text-white">
                  Invite Friends
                </h3>
                <p className="text-sm text-gray-400">
                  Share your invite code: {user?.invite_code || "N/A"}
                </p>
              </div>

              <div className="rounded-lg border border-gray-400 bg-gradient-dark p-4">
                <h3 className="mb-2 font-semibold text-white">
                  Pod Information
                </h3>
                <p className="text-sm text-gray-400">
                  Pod ID: {user?.pod_id || "Not assigned"}
                </p>
              </div>
            </div>
          </div>
        </WrapperContainer>
      </div>
    </MainPageScroll>
  );
};

export default ProfilePage;
