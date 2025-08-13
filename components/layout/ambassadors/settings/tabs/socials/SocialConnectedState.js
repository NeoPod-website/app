"use client";

import {
  Hash,
  Globe,
  LogOut,
  Calendar,
  RefreshCw,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Card, Chip, Button, CardBody } from "@heroui/react";

import DisconnectSocialModal from "@/components/ui/modals/DisconnectSocialModal";

import { toggleDisconnectedSocialModal } from "@/redux/slice/modalsSlice";
import Image from "next/image";

const SocialConnectedState = ({
  platforms,
  onRefresh,
  isLoading,
  onDisconnect,
  disconnectingPlatform,
}) => {
  const dispatch = useDispatch();

  const [isRefreshing, setIsRefreshing] = useState({});
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const handleDisconnectClick = (platformKey) => {
    setSelectedPlatform(platformKey);
    dispatch(toggleDisconnectedSocialModal());
  };

  const handleDisconnectConfirm = () => {
    if (selectedPlatform) {
      onDisconnect(selectedPlatform);
      setSelectedPlatform(null);
    }

    dispatch(toggleDisconnectedSocialModal());
  };

  const handleRefreshPlatform = async (platformKey) => {
    setIsRefreshing((prev) => ({ ...prev, [platformKey]: true }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onRefresh();
    } finally {
      setIsRefreshing((prev) => ({ ...prev, [platformKey]: false }));
    }
  };

  const getProfileUrl = (platformKey, platform) => {
    const value = platform.value;
    if (!value) return null;

    // Extract username from different formats
    let username = value;

    if (platformKey === "discord") {
      // Discord usernames might have discriminator, but no public profile URL
      return null;
    }

    // Remove @ symbol if present
    username = username.replace("@", "");

    const urlMappings = {
      discord: null,
      telegram: `https://t.me/${username}`,
      twitter: `https://twitter.com/${username}`,
    };
    return urlMappings[platformKey];
  };

  const getPlatformDisplayInfo = (platformKey, platform) => {
    // Use username if available, fallback to value
    const username = platform.username || platform.value;
    const displayName = platform.username || platform.value;

    if (!username) return { displayName: "Unknown", username: "N/A" };

    switch (platformKey) {
      case "discord":
        return {
          displayName: displayName,
          username: username.includes("#") ? username : `${username}`,
        };
      case "twitter":
        return {
          displayName: displayName.replace("@", ""),
          username: `@${displayName.replace("@", "")}`,
        };
      case "telegram":
        return {
          displayName: displayName.replace("@", ""),
          username: `@${displayName.replace("@", "")}`,
        };
      default:
        return { displayName, username };
    }
  };

  const getPlatformIcon = (platformKey) => {
    const iconMap = {
      discord: "text-indigo-400",
      twitter: "text-blue-400",
      telegram: "text-sky-400",
    };
    return iconMap[platformKey] || "text-gray-400";
  };

  // Filter only connected platforms
  const connectedPlatforms = Object.entries(platforms).filter(
    ([_, platform]) => platform.connected,
  );

  if (connectedPlatforms.length === 0) {
    return null;
  }

  return (
    <>
      <DisconnectSocialModal
        platforms={platforms}
        selectedPlatform={selectedPlatform}
        disconnectingPlatform={disconnectingPlatform}
        handleDisconnectConfirm={handleDisconnectConfirm}
      />

      <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
        <CardBody className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-400" />

              <h3 className="text-lg font-bold text-white">
                Connected Accounts
              </h3>
            </div>

            <Chip color="success" variant="flat" size="sm">
              {connectedPlatforms.length} Connected
            </Chip>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {connectedPlatforms.map(([platformKey, platform]) => {
              const profileUrl = getProfileUrl(platformKey, platform);
              const displayInfo = getPlatformDisplayInfo(platformKey, platform);

              // Check if this specific platform is being disconnected
              const isDisconnecting = disconnectingPlatform === platformKey;
              // Disable all disconnect buttons only when global loading OR when any platform is disconnecting
              const shouldDisableDisconnect =
                isLoading || !!disconnectingPlatform;

              return (
                <Card
                  key={platformKey}
                  className={`border transition-all ${platform.borderColor} bg-gradient-to-br ${platform.gradientFrom} ${platform.gradientTo} ${
                    isDisconnecting ? "opacity-60" : ""
                  }`}
                >
                  <CardBody className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-xl ${platform.color}/20 2xl:h-14 2xl:w-14`}
                            >
                              <Image
                                width={24}
                                height={24}
                                src={platform.icon}
                                alt={platform.name}
                                className="h-5 w-5 rounded 2xl:h-6 2xl:w-6"
                              />
                            </div>

                            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-600">
                              <CheckCircle size={12} className="text-white" />
                            </div>
                          </div>

                          <div className="flex-1">
                            <h4 className="flex items-center gap-2 truncate text-base font-bold text-white lg:text-lg">
                              {displayInfo.displayName}
                            </h4>

                            <div className="hidden items-center gap-2 sm:flex">
                              <span className="text-sm text-gray-200">
                                {displayInfo.username}
                              </span>

                              <Chip size="sm" variant="flat" color="success">
                                {isDisconnecting
                                  ? "Disconnecting..."
                                  : "Connected"}
                              </Chip>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            isIconOnly
                            variant="flat"
                            title="Refresh data"
                            isDisabled={shouldDisableDisconnect}
                            isLoading={isRefreshing[platformKey]}
                            onPress={() => handleRefreshPlatform(platformKey)}
                          >
                            <RefreshCw size={16} />
                          </Button>

                          {profileUrl && (
                            <Button
                              size="sm"
                              isIconOnly
                              variant="flat"
                              title="View profile"
                              isDisabled={isDisconnecting}
                              onPress={() => window.open(profileUrl, "_blank")}
                            >
                              <ExternalLink size={16} />
                            </Button>
                          )}

                          <Button
                            size="sm"
                            isIconOnly
                            variant="flat"
                            color="danger"
                            title="Disconnect"
                            isLoading={isDisconnecting}
                            isDisabled={shouldDisableDisconnect}
                            onPress={() => handleDisconnectClick(platformKey)}
                          >
                            <LogOut size={16} />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-4 rounded-lg border border-gray-700/50 bg-gray-900/50 p-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">
                            <CheckCircle size={20} className="mx-auto" />
                          </div>

                          <div className="mt-1 text-xs text-gray-100">
                            {isDisconnecting ? "Disconnecting" : "Verified"}
                          </div>
                        </div>

                        <div className="h-8 w-px bg-gray-600"></div>

                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">
                            <Globe size={20} className="mx-auto" />
                          </div>

                          <div className="mt-1 text-xs text-gray-100">
                            {isDisconnecting ? "Updating" : "Active"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-200">
                          <Calendar size={14} />
                          <span>Connected Recently</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-200">
                          <Hash size={14} />
                          <span>{platform.name}</span>
                        </div>
                      </div>

                      <div
                        className={`rounded-lg border p-3 ${
                          isDisconnecting
                            ? "border-orange-500/20 bg-orange-900/20"
                            : "border-green-500/20 bg-green-900/20"
                        }`}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <CheckCircle
                            size={16}
                            className={
                              isDisconnecting
                                ? "text-orange-400"
                                : "text-green-400"
                            }
                          />

                          <p
                            className={`text-sm font-medium ${
                              isDisconnecting
                                ? "text-orange-400"
                                : "text-green-400"
                            }`}
                          >
                            {isDisconnecting
                              ? "Disconnecting Account"
                              : "Verification Requirements Met"}
                          </p>
                        </div>

                        <div className="space-y-1 text-xs text-gray-100">
                          {isDisconnecting ? (
                            <>
                              <p>• Removing account connection...</p>
                              <p>• Updating verification status...</p>
                              <p>• Please wait for completion</p>
                            </>
                          ) : (
                            <>
                              <p>✓ Account successfully authenticated</p>
                              <p>✓ Basic profile information verified</p>
                              <p>✓ Meeting platform requirements</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 rounded-lg border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-600/20 flex h-8 w-8 items-center justify-center rounded-full">
                <CheckCircle size={16} className="text-blue-400" />
              </div>

              <div>
                <h4 className="mb-2 font-medium text-blue-400">
                  Connected Account Benefits
                </h4>

                <div className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm text-gray-200 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Enhanced ambassador verification</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                    <span>Access to exclusive campaigns</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <span>Higher reward tier eligibility</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <span>Community recognition status</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default SocialConnectedState;
