"use client";

import {
  Ban,
  Zap,
  User,
  Copy,
  Users,
  Award,
  Clock,
  Check,
  Wallet,
  Trophy,
  Target,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import React, { useState, useEffect } from "react";

import XIcon from "@/components/ui/socialIcons/XIcon";
import MainModal from "@/components/ui/modals/MainModal";
import DiscordIcon from "@/components/ui/socialIcons/DiscordIcon";
import TelegramIcon from "@/components/ui/socialIcons/TelegramIcon";
import Link from "next/link";

const UserInfoModal = ({ isOpen, onClose, ambassadorData, ambassadorId }) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(ambassadorData || null);

  useEffect(() => {
    if (isOpen && ambassadorId && !ambassadorData) {
      fetchAmbassadorData(ambassadorId);
    } else if (ambassadorData) {
      setUserData(ambassadorData);
    }
  }, [isOpen, ambassadorId, ambassadorData]);

  const fetchAmbassadorData = async (id) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/${id}`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      setUserData(data.data?.ambassador || data);
    } catch (error) {
      console.error("Failed to fetch ambassador data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainModal
      isOpen={isOpen}
      handleOnClose={onClose}
      title="Ambassador Profile"
      description="View detailed information about this ambassador"
      size="3xl"
    >
      {loading ? (
        <UserInfoSkeleton />
      ) : userData ? (
        <UserInfoContent userData={userData} />
      ) : (
        <NoUserData />
      )}
    </MainModal>
  );
};

const UserInfoContent = ({ userData }) => {
  const getStatusConfig = (status) => {
    const configs = {
      active: {
        text: "Active",
        icon: CheckCircle,
        bg: "bg-green-500/20",
        textColor: "text-green-400",
        border: "border-green-500/30",
      },

      suspended: {
        icon: Ban,
        text: "Suspended",
        bg: "bg-red-500/20",
        textColor: "text-red-400",
        border: "border-red-500/30",
      },

      inactive: {
        icon: Clock,
        text: "Inactive",
        bg: "bg-gray-500/20",
        textColor: "text-gray-400",
        border: "border-gray-500/30",
      },
    };

    return configs[status] || configs.active;
  };

  const statusConfig = getStatusConfig(userData.status);
  const StatusIcon = statusConfig.icon;

  const calculateSuccessRate = () => {
    if (!userData.total_quests_completed) return 0;
    return Math.round(
      (userData.total_rewards_claimed / userData.total_quests_completed) * 100,
    );
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border border-gray-700 bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6">
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white shadow-lg">
              {userData.profile_photo ? (
                <img
                  src={userData.profile_photo}
                  alt={userData.username}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User size={36} />
              )}
            </div>

            <div>
              <h3 className="text-2xl font-bold capitalize text-white">
                {userData.username}
              </h3>

              <p className="text-sm text-gray-400">{userData.email}</p>

              <div className="mt-2 flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusConfig.border} ${statusConfig.bg} ${statusConfig.textColor}`}
                >
                  <StatusIcon size={12} />
                  {statusConfig.text}
                </div>

                <div className="rounded-full border border-purple-500/30 bg-purple-500/20 px-3 py-1 text-xs font-medium capitalize text-purple-400">
                  {userData.role_type}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      {userData.status === "suspended" && userData.ban_reason && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <div className="flex items-start gap-3">
            <Ban className="mt-0.5 h-5 w-5 text-red-400" />

            <div className="flex-1">
              <h4 className="font-semibold text-red-400">Account Suspended</h4>

              <p className="mt-1 text-sm text-gray-300">
                {userData.ban_reason}
              </p>

              <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                <span>Banned by: {userData.banned_by}</span>
                {userData.unbanned_by && (
                  <span>Unbanned by: {userData.unbanned_by}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Trophy}
          label="Total Points"
          color="text-yellow-400"
          bgColor="bg-yellow-500/20"
          borderColor="border-yellow-500/30"
          value={userData.total_points?.toLocaleString() || 0}
        />

        <StatCard
          icon={Target}
          color="text-blue-400"
          label="Quests Completed"
          bgColor="bg-blue-500/20"
          borderColor="border-blue-500/30"
          value={userData.total_quests_completed || 0}
        />

        <StatCard
          icon={Award}
          color="text-green-400"
          label="Rewards Claimed"
          bgColor="bg-green-500/20"
          borderColor="border-green-500/30"
          value={userData.total_rewards_claimed || 0}
        />
      </div>

      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-300">
          <TrendingUp size={16} />
          Current Month Performance
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gray-900/50 p-3">
            <p className="text-xs text-gray-400">Points This Month</p>
            <p className="text-xl font-bold text-white">
              {userData.current_month_points?.toLocaleString() || 0}
            </p>
          </div>

          <div className="rounded-lg bg-gray-900/50 p-3">
            <p className="text-xs text-gray-400">Quests This Month</p>
            <p className="text-xl font-bold text-white">
              {userData.current_month_quests || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <InfoCard
          icon={Wallet}
          label="Wallet Address"
          fullValue={userData.wallet_address}
          copyable={!!userData.wallet_address}
          value={
            userData.wallet_address
              ? `${userData.wallet_address.slice(0, 6)}...${userData.wallet_address.slice(-4)}`
              : "Not connected"
          }
        />

        <InfoCard
          icon={Award}
          label="Tokens Earned"
          value={`${userData.total_tokens_earned || 0} tokens`}
        />
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-300">
          Connected Accounts
        </h4>

        <div className="grid gap-3 lg:grid-cols-3">
          <SocialCard
            icon={XIcon}
            color="text-white"
            platform="X (Twitter)"
            bgColor="bg-gray-800/50"
            userId={userData.twitter}
            username={userData.twitter_username}
          />

          <SocialCard
            icon={DiscordIcon}
            platform="Discord"
            color="text-indigo-400"
            userId={userData.discord}
            bgColor="bg-indigo-500/10"
            username={userData.discord_username}
          />

          <SocialCard
            icon={TelegramIcon}
            platform="Telegram"
            color="text-blue-400"
            bgColor="bg-blue-500/10"
            userId={userData.telegram}
            username={userData.telegram_username}
          />
        </div>
      </div>

      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-300">
          <Users size={16} />
          Referral Stats
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gray-900/50 p-3">
            <p className="text-xs text-gray-400">Total Invites</p>
            <p className="text-xl font-bold text-white">
              {userData.invite_count || 0}
            </p>
          </div>

          <div className="rounded-lg bg-gray-900/50 p-3">
            <p className="text-xs text-gray-400">Valid Invites</p>
            <p className="text-xl font-bold text-green-400">
              {userData.valid_invite_count || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-300">Activity</h4>

        <div className="space-y-2">
          <TimelineItem
            icon={Calendar}
            label="Joined"
            value={formatDate(userData.joining_date)}
          />

          <TimelineItem
            icon={Clock}
            label="Last Login"
            value={formatRelativeTime(userData.last_login)}
          />

          <TimelineItem
            icon={Trophy}
            label="Last Quest Completed"
            value={formatRelativeTime(userData.last_quest_completed)}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
  borderColor,
}) => {
  return (
    <div className={`rounded-lg border ${borderColor} ${bgColor} p-4`}>
      <div className="mb-2 flex items-center gap-2">
        <Icon size={18} className={color} />
        <span className="text-xs text-gray-400">{label}</span>
      </div>

      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value, fullValue, copyable }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (copyable && fullValue) {
      navigator.clipboard.writeText(fullValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
      <div className="rounded-lg bg-gray-700/50 p-2">
        <Icon size={18} className="text-gray-300" />
      </div>

      <div className="flex-1">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
      </div>

      {copyable && (
        <button
          onClick={handleCopy}
          className="rounded-lg bg-gray-700/50 p-2 text-gray-300 transition-colors hover:bg-gray-700"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      )}
    </div>
  );
};

const SocialCard = ({
  icon: Icon,
  platform,
  username,
  userId,
  color,
  bgColor,
}) => {
  const getSocialLink = () => {
    if (!username && !userId) return null;

    switch (platform) {
      case "X (Twitter)":
        return username
          ? `https://twitter.com/${username}`
          : `https://twitter.com/i/user/${userId}`;

      case "Discord":
        // Discord doesn't have direct profile links, but we can show the username
        // You could open Discord app with discord://users/{userId} if needed
        return null;

      case "Telegram":
        return username ? `https://t.me/${username}` : null;

      default:
        return null;
    }
  };

  const socialLink = getSocialLink();
  const isClickable = !!socialLink;

  const content = (
    <>
      <div className="mb-2 flex items-center gap-2">
        <Icon size={16} className={color + " h-5 w-5"} />
        <span className="text-xs text-gray-400">{platform}</span>
        {isClickable && (
          <ExternalLink size={12} className="ml-auto text-gray-500" />
        )}
      </div>

      {username ? (
        <p className="truncate text-sm font-medium text-white">@{username}</p>
      ) : (
        <p className="text-xs text-gray-500">Not connected</p>
      )}
    </>
  );

  if (isClickable) {
    return (
      <Link
        target="_blank"
        href={socialLink}
        rel="noopener noreferrer"
        className={`group rounded-lg border border-gray-700 ${bgColor} p-3 transition-all hover:border-gray-600 hover:bg-gray-700/50`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={`rounded-lg border border-gray-700 ${bgColor} p-3`}>
      {content}
    </div>
  );
};

const TimelineItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800/50 p-3">
      <Icon size={16} className="text-gray-400" />
      <div className="flex-1">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
};

const UserInfoSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-32 rounded-xl bg-gray-800" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-lg bg-gray-800" />
        ))}
      </div>

      <div className="h-24 rounded-lg bg-gray-800" />

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="h-20 rounded-lg bg-gray-800" />
        <div className="h-20 rounded-lg bg-gray-800" />
      </div>
    </div>
  );
};

const NoUserData = () => {
  return (
    <div className="py-12 text-center">
      <AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-600" />
      <p className="text-gray-400">Unable to load ambassador information</p>
    </div>
  );
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatRelativeTime = (dateString) => {
  if (!dateString) return "N/A";
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now.getTime() - date.getTime();

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return formatDate(dateString);
};

export default UserInfoModal;
