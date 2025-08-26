import React from "react";
import { cookies } from "next/headers";

import WrapperContainer from "@/components/common/WrapperContainer";
import SettingsHeader from "@/components/layout/ambassadors/settings/SettingsHeader";
import SettingsContent from "@/components/layout/ambassadors/settings/SettingsContent";

const fetchUserData = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/profile/me`,
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

  return data.user;
};

const SettingsPage = async ({ searchParams }) => {
  const params = await searchParams;
  const activeTab = params?.tab || "profile";

  const user = await fetchUserData();

  return (
    <WrapperContainer scrollable={true}>
      <div className="space-y-1 px-4 py-5 xl:px-6 xl:py-6 3xl:px-8 3xl:py-8">
        <h1 className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-2xl font-bold text-transparent 3xl:text-3xl">
          Settings
        </h1>

        <p className="text-sm text-gray-200 3xl:text-base">
          Customize your experience and manage your account
        </p>
      </div>

      <SettingsHeader activeTab={activeTab} />
      <SettingsContent activeTab={activeTab} user={user} />
    </WrapperContainer>
  );
};

export default SettingsPage;
