import React from "react";

import WalletTab from "./tabs/WalletTab";
import ProfileTab from "./tabs/ProfileTab";
import SocialsTab from "./tabs/SocialsTab";
import SecurityTab from "./tabs/SecurityTab";
import AppearanceTab from "./tabs/AppearanceTab";
import NotificationsTab from "./tabs/NotificationsTab";

import { getCachedSession } from "@/lib/userSession";

const SettingsContent = async ({ activeTab }) => {
  const { user } = await getCachedSession();

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "wallet":
        return <WalletTab ambassadorAddress={user?.wallet_address} />;
      case "socials":
        return (
          <SocialsTab
            twitter={user.twitter || null}
            discord={user.discord || null}
            telegram={user.telegram || null}
            twitterUsername={user.twitter_username || null}
            discordUsername={user.discord_username || null}
            telegramUsername={user.telegram_username || null}
          />
        );
      case "security":
        return <SecurityTab />;
      case "notifications":
        return <NotificationsTab />;
      case "appearance":
        return <AppearanceTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <section className="flex-1 overflow-auto p-8 scrollbar-hide">
      {renderContent()}
    </section>
  );
};

export default SettingsContent;
