"use client";

import { Users } from "lucide-react";
import { Spinner, addToast } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import SocialsOverview from "./socials/SocialsOverview";
import SocialPlatformsList from "./socials/SocialPlatformsList";
import SocialConnectedState from "./socials/SocialConnectedState";
import SocialVerificationFlow from "./socials/SocialVerificationFlow";
import TelegramVerificationFlow from "./socials/TelegramVerificationFlow";

const SocialsTab = ({
  twitter,
  discord,
  telegram,
  twitterUsername,
  discordUsername,
  telegramUsername,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [socialState, setSocialState] = useState({
    error: null,
    isLoading: false,
    lastUpdated: null,
    disconnectingPlatform: null, // Track which platform is being disconnected
  });

  const [activeVerification, setActiveVerification] = useState(null);

  // Handle OAuth callback
  useEffect(() => {
    const error = searchParams.get("error");
    const success = searchParams.get("success");
    const message = searchParams.get("message");
    const platform = searchParams.get("platform");

    if (success === "true" && platform && platform !== "telegram") {
      const successMessage = message
        ? decodeURIComponent(message)
        : `${platform} connected successfully!`;

      addToast({
        title: "Connection Successful",
        description: successMessage,
        color: "success",
        timeout: 4000,
      });

      setSocialState((prev) => ({
        ...prev,
        lastUpdated: new Date(),
        error: null,
      }));

      const newParams = new URLSearchParams(searchParams);
      newParams.delete("error");
      newParams.delete("success");
      newParams.delete("message");
      newParams.delete("platform");

      router.replace(`/settings?${newParams.toString()}`, { scroll: false });

      setTimeout(() => {
        router.refresh();
      }, 2000);
    } else if (error && platform !== "telegram") {
      const errorMessage = message
        ? decodeURIComponent(message)
        : decodeURIComponent(error);

      addToast({
        title: "Connection Failed",
        description: errorMessage,
        color: "danger",
        timeout: 6000,
      });

      setSocialState((prev) => ({
        ...prev,
        error: errorMessage,
      }));

      const newParams = new URLSearchParams(searchParams);
      newParams.delete("error");
      newParams.delete("success");
      newParams.delete("message");
      newParams.delete("platform");

      router.replace(`/settings?${newParams.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  // Simplified social platforms configuration
  const socialPlatforms = {
    twitter: {
      name: "Twitter/X",
      icon: "/auth/social/x.svg",
      color: "bg-black",
      borderColor: "border-blue-500/20",
      gradientFrom: "from-blue-900/30",
      gradientTo: "to-cyan-900/30",
      description: "Verify your Twitter/X account for social engagement quests",
      connected: !!(twitter && twitter.trim()),
      value: twitter,
      username: twitterUsername,
      displayValue: twitterUsername || twitter,
      verification: {
        // ✅ ENFORCED REQUIREMENTS (FREE - no API calls needed)
        requiresValidUserId: true, // ✅ OAuth provides valid user ID
        requiresValidUsername: true, // ✅ OAuth provides valid username
        requiresMinimumAge: true, // ✅ Basic age check using Twitter ID snowflake
        requiresQualityUsername: true, // ✅ Username pattern validation

        // ⭐ BASIC DETECTION (from OAuth data only)
        detectsAccountAge: true, // ⭐ Estimated age from Twitter ID
        detectsUsernameQuality: true, // ⭐ Username quality scoring
      },
      requiredScopes: ["basic_profile", "account_verification"],
      authEndpoints: {
        login: "/socials/twitter/login",
        disconnect: "/socials/twitter/disconnect",
      },
      verificationFlow: "oauth",

      // ✅ UPDATED: Minimal requirements for UI display (free validation only)
      detailedRequirements: {
        required: [
          {
            name: "Valid Twitter Account",
            description: "Must be a legitimate Twitter/X account",
            icon: "CheckCircleIcon",
            status: "required",
          },
          {
            name: "Proper Username Format",
            description: "Username must follow Twitter's format guidelines",
            icon: "UserIcon",
            status: "required",
          },
          {
            name: "Account Age Check",
            description: "Account must not be brand new (7+ days estimated)",
            icon: "CalendarIcon",
            status: "required",
          },
          {
            name: "Quality Username",
            description: "Username should not follow spam/bot patterns",
            icon: "ShieldCheckIcon",
            status: "required",
          },
        ],
        optional: [
          {
            name: "Established Account",
            description: "Older accounts receive higher verification scores",
            icon: "TrendingUpIcon",
            status: "bonus",
          },
          {
            name: "Quality Username Score",
            description: "Well-formed usernames get bonus verification points",
            icon: "StarIcon",
            status: "bonus",
          },
        ],
        limitations: [
          {
            name: "Limited Validation",
            description: "Full profile validation requires Twitter API access",
            icon: "AlertCircleIcon",
            status: "info",
          },
        ],
      },

      // ✅ UPDATED: Simplified scoring (no API data)
      scoringInfo: {
        baseRequirements: 70, // Higher base since we can't validate much
        bonusFeatures: {
          establishedAccount: 20, // Based on estimated age
          qualityUsername: 10, // Based on username patterns
        },
        maxScore: 100,
        note: "Limited validation due to Twitter API restrictions",
      },
    },

    telegram: {
      name: "Telegram",
      icon: "/auth/social/telegram.svg",
      color: "bg-sky-600",
      borderColor: "border-indigo-500/20",
      gradientFrom: "from-indigo-900/30",
      gradientTo: "to-purple-900/30",
      description:
        "Connect your Telegram to verify group membership for quests",
      connected: !!(telegram && telegram.trim()),
      value: telegram,
      username: telegramUsername,
      displayValue: telegramUsername || telegram,
      verification: {
        // ✅ ENFORCED REQUIREMENTS
        requiresUsername: true, // ✅ Backend validates username exists
        requiresValidUsername: true, // ✅ Backend validates username format
        requiresFirstName: true, // ✅ Backend validates profile completeness
        requiresHumanAccount: true, // ✅ Backend blocks bot accounts

        // ⭐ BONUS REQUIREMENTS (detected but not required)
        detectsPremium: true, // ⭐ Detects premium accounts for higher scoring
        detectsLanguage: true, // ⭐ Detects user language for regional verification
      },
      requiredScopes: [
        "basic_profile",
        "username_access",
        "group_verification",
      ],
      authEndpoints: {
        disconnect: "/socials/telegram/disconnect",
      },
      verificationFlow: "bot_verification",
      botUsername:
        process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "neopod_bot",

      // ✅ NEW: Detailed requirements for UI display
      detailedRequirements: {
        required: [
          {
            name: "Public Username",
            description: "Must have a public @username set",
            icon: "UserIcon",
            status: "required",
          },
          {
            name: "Valid Username Format",
            description: "Username must be 5-32 characters, start with letter",
            icon: "CheckIcon",
            status: "required",
          },
          {
            name: "Complete Profile",
            description: "Must have first name set in profile",
            icon: "UserCircleIcon",
            status: "required",
          },
          {
            name: "Human Account",
            description: "Bot accounts are not eligible",
            icon: "ShieldCheckIcon",
            status: "required",
          },
        ],
        optional: [
          {
            name: "Premium Account",
            description:
              "Telegram Premium accounts get higher verification score",
            icon: "StarIcon",
            status: "bonus",
          },
          {
            name: "Profile Language",
            description: "Helps with regional quest matching",
            icon: "GlobeIcon",
            status: "detected",
          },
        ],
      },
    },

    discord: {
      name: "Discord",
      icon: "/auth/social/discord.svg",
      color: "bg-purple-600",
      borderColor: "border-sky-500/20",
      gradientFrom: "from-sky-900/30",
      gradientTo: "to-blue-900/30",
      description:
        "Connect your Discord to verify server membership for quests",
      connected: !!(discord && discord.trim()),
      value: discord,
      username: discordUsername,
      displayValue: discordUsername || discord,
      verification: {
        minAccountAge: 7,
        minServerCount: 1,
        requiresUsername: true,
      },
      requiredScopes: ["identify", "guilds", "email"],
      authEndpoints: {
        login: "/socials/discord/login",
        disconnect: "/socials/discord/disconnect",
      },
      verificationFlow: "oauth",
    },
  };

  // Calculate stats
  const connectedCount = Object.values(socialPlatforms).filter(
    (p) => p.connected,
  ).length;
  const totalPlatforms = Object.keys(socialPlatforms).length;

  const handleStartVerification = (platformKey) => {
    const platform = socialPlatforms[platformKey];

    if (!platform) {
      addToast({
        title: "Error",
        description: `Platform ${platformKey} not found`,
        color: "danger",
      });
      return;
    }

    setActiveVerification(platformKey);
  };

  const handleDisconnectSocial = async (platformKey) => {
    const platform = socialPlatforms[platformKey];
    if (!platform) {
      addToast({
        title: "Error",
        description: `Platform ${platformKey} not found`,
        color: "danger",
      });
      return;
    }

    try {
      // 🔥 FIX 1: Set disconnecting platform to disable only that button
      setSocialState((prev) => ({
        ...prev,
        disconnectingPlatform: platformKey,
        error: null,
      }));

      const endpoint =
        platformKey === "telegram"
          ? `${process.env.NEXT_PUBLIC_API_URL}/socials/telegram/disconnect`
          : `${process.env.NEXT_PUBLIC_API_URL}${platform.authEndpoints.disconnect}`;

      const response = await fetch(endpoint, {
        method: platformKey === "telegram" ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to disconnect ${platform.name}`,
        );
      }

      addToast({
        title: "Disconnected Successfully",
        description: `${platform.name} has been disconnected from your account`,
        color: "success",
        timeout: 4000,
      });

      // 🔥 FIX 2: Clear disconnecting state immediately and refresh
      setSocialState((prev) => ({
        ...prev,
        disconnectingPlatform: null,
        lastUpdated: new Date(),
      }));

      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error(`Error disconnecting ${platformKey}:`, error);

      addToast({
        title: "Disconnection Failed",
        description: `Failed to disconnect ${platform.name}: ${error.message}`,
        color: "danger",
        timeout: 6000,
      });

      // 🔥 FIX 3: Clear disconnecting state on error too
      setSocialState((prev) => ({
        ...prev,
        error: `Failed to disconnect ${platform.name}: ${error.message}`,
        disconnectingPlatform: null,
      }));
    }
  };

  const handleRefreshSocials = async () => {
    // 🔥 FIX 4: Prevent infinite loading with proper async handling
    if (socialState.isLoading) return; // Prevent multiple refreshes

    setSocialState((prev) => ({ ...prev, isLoading: true, error: null }));

    addToast({
      title: "Refreshing...",
      description: "Updating your social connections",
      color: "default",
      timeout: 2000,
    });

    try {
      // Use router.refresh() which returns a promise
      await new Promise((resolve) => {
        router.refresh();
        // Give the refresh time to complete
        setTimeout(resolve, 1500);
      });

      // 🔥 FIX 5: Update state with completion
      setSocialState((prev) => ({
        ...prev,
        isLoading: false,
        lastUpdated: new Date(),
      }));

      addToast({
        title: "Refreshed",
        description: "Social connections updated successfully",
        color: "success",
        timeout: 2000,
      });
    } catch (error) {
      console.error("Refresh error:", error);
      setSocialState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to refresh social connections",
      }));
    }
  };

  const handleCancelVerification = () => {
    setActiveVerification(null);
  };

  const handleVerificationSuccess = (platformKey, profileData) => {
    console.log(`Verification successful for ${platformKey}:`, profileData);
    setActiveVerification(null);

    addToast({
      title: "Verification Complete",
      description: `${socialPlatforms[platformKey]?.name} has been successfully verified`,
      color: "success",
      timeout: 4000,
    });

    setSocialState((prev) => ({
      ...prev,
      lastUpdated: new Date(),
      error: null,
    }));

    setTimeout(() => {
      router.refresh();
    }, 1000);
  };

  const handleVerificationError = (error) => {
    console.error("Verification error:", error);

    addToast({
      title: "Verification Failed",
      description: error.message || "Verification could not be completed",
      color: "danger",
      timeout: 6000,
    });

    setSocialState((prev) => ({
      ...prev,
      error: error.message || "Verification failed",
    }));
    setActiveVerification(null);
  };

  // Loading state
  if (
    twitter === undefined ||
    discord === undefined ||
    telegram === undefined
  ) {
    return (
      <div className="mx-auto mt-10 text-center">
        <Spinner size="lg" className="mb-4" color="white" />
        <h3 className="mb-2 text-lg font-medium text-white">
          Loading Social Data
        </h3>
        <p className="text-sm text-gray-200">
          Fetching your social connections...
        </p>
      </div>
    );
  }

  // Show verification flow if active
  if (activeVerification) {
    const platform = socialPlatforms[activeVerification];

    // Use custom Telegram verification flow
    if (activeVerification === "telegram") {
      return (
        <TelegramVerificationFlow
          platform={platform}
          platformKey={activeVerification}
          onBack={handleCancelVerification}
          onSuccess={handleVerificationSuccess}
          onError={handleVerificationError}
        />
      );
    }

    // Use standard OAuth flow for other platforms
    return (
      <SocialVerificationFlow
        platform={platform}
        platformKey={activeVerification}
        onBack={handleCancelVerification}
        onSuccess={handleVerificationSuccess}
        onError={handleVerificationError}
      />
    );
  }

  return (
    <div className="space-y-4 3xl:space-y-8">
      <SocialsOverview
        platforms={socialPlatforms}
        verificationCount={connectedCount}
        totalPlatforms={totalPlatforms}
        lastUpdated={socialState.lastUpdated}
        onRefresh={handleRefreshSocials}
        isRefreshing={socialState.isLoading}
      />

      {connectedCount > 0 && (
        <SocialConnectedState
          platforms={socialPlatforms}
          onDisconnect={handleDisconnectSocial}
          onRefresh={handleRefreshSocials}
          isLoading={socialState.isLoading}
          disconnectingPlatform={socialState.disconnectingPlatform}
        />
      )}

      <SocialPlatformsList
        platforms={socialPlatforms}
        onStartVerification={handleStartVerification}
        isLoading={socialState.isLoading}
      />

      {socialState.error && (
        <div className="rounded-lg border border-red-500/50 bg-gradient-to-br from-red-900/20 to-orange-900/20 p-6 backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/20">
              <Users size={16} className="text-red-400" />
            </div>

            <div>
              <h4 className="mb-2 font-medium text-red-400">
                Social Connection Error
              </h4>

              <p className="text-sm text-gray-300">{socialState.error}</p>

              <button
                onClick={() =>
                  setSocialState((prev) => ({ ...prev, error: null }))
                }
                className="mt-3 rounded bg-red-600/20 px-3 py-1 text-sm text-red-400 transition-colors hover:bg-red-600/30"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialsTab;
