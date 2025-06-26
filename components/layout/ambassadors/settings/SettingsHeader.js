"use client";

import {
  UserIcon,
  BellIcon,
  WalletIcon,
  ShieldIcon,
  PaletteIcon,
  ExternalLinkIcon,
} from "lucide-react";
import React from "react";
import { Tabs, Tab } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";

const settingsTabs = [
  {
    key: "profile",
    title: "Profile",
    icon: UserIcon,
  },

  {
    key: "wallet",
    title: "Wallet",
    icon: WalletIcon,
  },

  {
    key: "socials",
    title: "Social Media",
    icon: ExternalLinkIcon,
  },

  // {
  //   key: "security",
  //   title: "Security",
  //   icon: ShieldIcon,
  // },

  // {
  //   key: "notifications",
  //   title: "Notifications",
  //   icon: BellIcon,
  // },

  {
    key: "appearance",
    title: "Appearance",
    icon: PaletteIcon,
  },
];

const SettingsHeader = ({ activeTab }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (key) => {
    // Create new URLSearchParams to preserve other params if any
    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", key);

    // Build the new URL
    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.push(`/settings${newUrl}`);
  };

  return (
    <Tabs
      variant="underlined"
      selectedKey={activeTab}
      aria-label="Settings tabs"
      onSelectionChange={handleTabChange}
      classNames={{
        base: "w-full",
        tabList: "w-full gap-8 rounded-none p-0 border-b border-gray-500",
        cursor: "w-full bg-gradient-to-r from-blue-500 to-purple-500",
        tab: "px-0 h-12",
        tabContent:
          "group-data-[selected=true]:text-white text-gray-100 font-medium",
      }}
    >
      {settingsTabs.map((tab) => {
        const IconComponent = tab.icon;
        return (
          <Tab
            key={tab.key}
            title={
              <div className="flex items-center space-x-2">
                <IconComponent size={18} />
                <span>{tab.title}</span>
              </div>
            }
          />
        );
      })}
    </Tabs>
  );
};

export default SettingsHeader;
