import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, UsersIcon, GiftIcon, TrophyIcon } from "lucide-react";

import AuthMainContainer from "@/components/layout/auth/AuthMainContainer";

// Server function to fetch inviter information
const fetchInviterInfo = async (inviteCode) => {
  try {
    if (!inviteCode) return null;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/inviter/${inviteCode}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      // Return fallback data instead of throwing
      return { username: "Community Member", invite_count: 0 };
    }

    const data = await response.json();

    return data.data;
  } catch (err) {
    return { username: "Community Member", invite_count: 0 };
  }
};

// Action links styled as buttons
const InviteActions = ({ inviteCode }) => {
  return (
    <div className="space-y-3">
      <Link
        href={`/login?inviteCode=${inviteCode}`}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white p-4 text-base font-semibold text-black transition-colors hover:bg-gray-100"
      >
        Get Started
        <ArrowRightIcon size={16} />
      </Link>
    </div>
  );
};

const InvitePage = async ({ searchParams }) => {
  const { inviteCode } = await searchParams;

  if (!inviteCode) {
    return (
      <AuthMainContainer
        title="Invalid Invite"
        description="This invite link appears to be invalid."
      >
        <Link
          href="/login"
          className="flex h-12 w-full items-center justify-center rounded-lg bg-white p-4 text-base font-semibold text-black transition-colors hover:bg-gray-100"
        >
          Go to Login
        </Link>
      </AuthMainContainer>
    );
  }

  // Fetch inviter data on server
  const inviterData = await fetchInviterInfo(inviteCode);

  return (
    <AuthMainContainer
      margin="space-y-4"
      className="-mt-24"
      title="You're Invited!"
      description={
        inviterData ? (
          <div className="space-y-3">
            <p>
              <span className="text-center font-semibold capitalize text-white">
                {inviterData.username}
              </span>{" "}
              invited you to join the NeoPod community
            </p>

            <div className="flex items-center justify-center gap-3 rounded-lg border border-gray-400 bg-gradient-dark p-3">
              <Image
                width={36}
                height={36}
                alt={inviterData.username}
                src={
                  inviterData.profile_photo ||
                  "/dashboard/profile/default-profile.png"
                }
                className="overflow-hidden rounded-full"
              />

              <div className="text-left">
                <p className="text-sm font-medium capitalize text-white">
                  {inviterData.username}
                </p>

                <p className="text-xs text-gray-100">
                  {inviterData.invite_count || 0} successful invites
                </p>
              </div>
            </div>
          </div>
        ) : (
          "Join the exclusive NeoPod community and start your journey"
        )
      }
      isAdmin={true}
    >
      <div className="mb-4 space-y-4">
        <h3 className="text-center text-lg font-semibold text-white">
          What you'll get:
        </h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg border border-gray-400 bg-dark p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
              <TrophyIcon className="h-4 w-4 text-green-400" />
            </div>

            <div>
              <p className="text-sm font-medium text-white">Complete Quests</p>
              <p className="text-xs text-gray-100">Earn XP and rewards</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-400 bg-dark p-3">
            <div className="bg-blue-500/20 flex h-8 w-8 items-center justify-center rounded-full">
              <UsersIcon className="h-4 w-4 text-blue-400" />
            </div>

            <div>
              <p className="text-sm font-medium text-white">Join Community</p>
              <p className="text-xs text-gray-100">
                Connect with like-minded people
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1 rounded-lg border border-gray-400 bg-gradient-dark py-2.5">
        <div className="flex items-center justify-center gap-2">
          <GiftIcon className="h-4 w-4 text-gray-100" />
          <p className="text-xs text-gray-100">Your invite code</p>
        </div>

        <div className="text-center font-mono text-2xl font-bold tracking-wider text-white">
          {inviteCode}
        </div>
      </div>

      <InviteActions inviteCode={inviteCode} />
    </AuthMainContainer>
  );
};

export default InvitePage;
