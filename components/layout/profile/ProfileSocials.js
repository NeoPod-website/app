import React from "react";
import Link from "next/link";

import XIcon from "@/components/ui/socialIcons/XIcon";
import DiscordIcon from "@/components/ui/socialIcons/DiscordIcon";
import TelegramIcon from "@/components/ui/socialIcons/TelegramIcon";

// Helper function to truncate social usernames
const truncateSocial = (username, maxLength = 12) => {
  if (!username) return "Not connected";
  if (username.length <= maxLength) return username;
  return username.substring(0, maxLength) + "...";
};

// Helper function to get social platform URL
const getSocialUrl = (platform, username) => {
  if (!username) return "#";

  const urls = {
    twitter: `https://twitter.com/${username}`,
    discord: `https://discord.com/users/${username}`,
    telegram: `https://t.me/${username}`,
  };

  return urls[platform] || "#";
};

const ProfileSocials = ({ user }) => {
  const socials = [
    {
      platform: "twitter",
      username: user?.twitter_username,
      icon: XIcon,
      label: "Twitter",
    },

    {
      platform: "discord",
      username: user?.discord_username,
      icon: DiscordIcon,
      label: "Discord",
    },

    {
      platform: "telegram",
      username: user?.telegram_username,
      icon: TelegramIcon,
      label: "Telegram",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 2xl:gap-5 3xl:gap-7">
      {socials.map((social, index) => {
        const IconComponent = social.icon;
        const isConnected = social.username;

        return (
          <React.Fragment key={social.platform}>
            {isConnected ? (
              <Link
                href={getSocialUrl(social.platform, social.username)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-gray-400 bg-gradient-dark px-4 py-2.5 transition-opacity hover:bg-opacity-80"
                title={`${social.label}: ${social.username}`}
              >
                <IconComponent className="h-5 w-5 text-white" />

                <p className="text-sm text-white 3xl:text-base">
                  {truncateSocial(social.username)}
                </p>
              </Link>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-gray-400 bg-opacity-50 bg-gradient-dark px-4 py-2.5">
                <IconComponent className="h-5 w-5 text-gray-300" />

                <p className="text-sm text-gray-300 3xl:text-base">
                  Not connected
                </p>
              </div>
            )}

            {index < socials.length - 1 && (
              <div className="h-11 w-px bg-gray-400" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProfileSocials;
