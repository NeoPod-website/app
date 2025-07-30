import React from "react";

import WrapperContainer from "@/components/common/WrapperContainer";
import SettingsHeader from "@/components/layout/ambassadors/settings/SettingsHeader";
import SettingsContent from "@/components/layout/ambassadors/settings/SettingsContent";

const SettingsPage = async ({ searchParams }) => {
  const params = await searchParams;
  const activeTab = params?.tab || "profile";

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
      <SettingsContent activeTab={activeTab} />
    </WrapperContainer>
  );
};

export default SettingsPage;
