import React from "react";

import WalletTab from "./tabs/WalletTab";
import ProfileTab from "./tabs/ProfileTab";
import SocialsTab from "./tabs/SocialsTab";
import SecurityTab from "./tabs/SecurityTab";
import AppearanceTab from "./tabs/AppearanceTab";
import NotificationsTab from "./tabs/NotificationsTab";

const SettingsContent = async ({ activeTab, user }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab user={user} />;
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
      // case "security":
      //   return <SecurityTab />;
      // case "notifications":
      //   return <NotificationsTab />;
      // case "appearance":
      //   return <AppearanceTab />;
      default:
        return <ProfileTab user={user} />;
    }
  };

  return (
    <section className="flex-1 overflow-auto p-2 scrollbar-hide md:p-6 3xl:p-8">
      {renderContent()}
    </section>
  );
};

export default SettingsContent;
