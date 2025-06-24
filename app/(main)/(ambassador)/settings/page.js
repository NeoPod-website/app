import React from "react";

import WrapperContainer from "@/components/common/WrapperContainer";
import SettingsHeader from "@/components/layout/ambassadors/settings/SettingsHeader";
import SettingsContent from "@/components/layout/ambassadors/settings/SettingsContent";

const SettingsPage = async ({ searchParams }) => {
  const params = await searchParams;
  const activeTab = params?.tab || "profile";

  return (
    <WrapperContainer scrollable={true}>
      <div className="space-y-1 p-8">
        <h1 className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-3xl font-bold text-transparent">
          Settings
        </h1>

        <p className="text-base text-gray-200">
          Customize your experience and manage your account
        </p>
      </div>

      <SettingsHeader activeTab={activeTab} />
      <SettingsContent activeTab={activeTab} />
    </WrapperContainer>
  );
};

export default SettingsPage;
