"use client";

import {
  LinkIcon,
  StarIcon,
  UsersIcon,
  ShieldIcon,
  CalendarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  UserIcon,
  CheckIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  GlobeIcon,
  MessageCircleIcon,
  AlertCircleIcon,
} from "lucide-react";
import React from "react";
import Image from "next/image";
import { Card, CardBody, Button, Chip } from "@heroui/react";

const SocialPlatformsList = ({ platforms, onStartVerification }) => {
  const getPlatformStatus = (platform) => {
    if (platform.connected) {
      return { status: "verified", text: "Connected", color: "success" };
    }
    return { status: "unverified", text: "Not Connected", color: "default" };
  };

  const getRequirementIcon = (iconName) => {
    const iconMap = {
      UserIcon,
      StarIcon,
      CheckIcon,
      GlobeIcon,
      UsersIcon,
      ShieldIcon,
      CalendarIcon,
      UserCircleIcon,
      ShieldCheckIcon,
      CheckCircleIcon,
      AlertCircleIcon,
      MessageCircleIcon,
      ActivityIcon: StarIcon,
      ThumbsUpIcon: CheckIcon,
      ImageIcon: UserCircleIcon,
      TrendingUpIcon: ArrowRightIcon,
      BadgeCheckIcon: CheckCircleIcon,
    };
    return iconMap[iconName] || StarIcon;
  };

  const formatRequirements = (verification, detailedRequirements) => {
    // If platform has detailed requirements, use those
    if (detailedRequirements) {
      return detailedRequirements.required.map((req) => ({
        text: req.name,
        description: req.description,
        icon: getRequirementIcon(req.icon),
        status: req.status,
      }));
    }

    // Fallback to legacy format
    const requirements = [];

    if (verification.minFollowers) {
      requirements.push({
        text: `${verification.minFollowers}+ followers`,
        icon: UsersIcon,
        status: "required",
      });
    }
    if (verification.minSubscribers) {
      requirements.push({
        text: `${verification.minSubscribers}+ subscribers`,
        icon: UsersIcon,
        status: "required",
      });
    }
    if (verification.minConnections) {
      requirements.push({
        text: `${verification.minConnections}+ connections`,
        icon: UsersIcon,
        status: "required",
      });
    }
    if (verification.minAccountAge) {
      requirements.push({
        text: `${verification.minAccountAge}+ days old`,
        icon: CalendarIcon,
        status: "required",
      });
    }
    if (verification.minChannelAge) {
      requirements.push({
        text: `${verification.minChannelAge}+ days old channel`,
        icon: CalendarIcon,
        status: "required",
      });
    }
    if (verification.minVideos) {
      requirements.push({
        text: `${verification.minVideos}+ videos`,
        icon: StarIcon,
        status: "required",
      });
    }
    if (verification.minPosts) {
      requirements.push({
        text: `${verification.minPosts}+ posts`,
        icon: StarIcon,
        status: "required",
      });
    }
    if (verification.minServerCount) {
      requirements.push({
        text: `${verification.minServerCount}+ servers`,
        icon: UsersIcon,
        status: "required",
      });
    }
    if (verification.requiresVerifiedEmail) {
      requirements.push({
        text: "Verified email",
        icon: ShieldIcon,
        status: "required",
      });
    }
    if (verification.requiresUsername) {
      requirements.push({
        text: "Public username",
        icon: UserIcon,
        status: "required",
      });
    }
    if (verification.requiresCompletedProfile) {
      requirements.push({
        text: "Complete profile",
        icon: UserCircleIcon,
        status: "required",
      });
    }
    if (verification.requiresBusinessAccount) {
      requirements.push({
        text: "Business account",
        icon: ShieldCheckIcon,
        status: "required",
      });
    }

    return requirements;
  };

  const getPriorityLevel = (platformKey) => {
    const priorities = {
      discord: {
        level: "High",
        color: "warning",
        description: "Community engagement & verification",
      },
      twitter: {
        level: "High",
        color: "danger",
        description: "Essential for crypto ambassadors",
      },
      telegram: {
        level: "Medium",
        color: "primary",
        description: "Crypto community reach",
      },
      linkedin: {
        level: "Medium",
        color: "secondary",
        description: "Professional networking",
      },
      youtube: {
        level: "Low",
        color: "default",
        description: "Content creation",
      },
      instagram: {
        level: "Low",
        color: "default",
        description: "Visual content",
      },
    };
    return (
      priorities[platformKey] || {
        level: "Low",
        color: "default",
        description: "Additional reach",
      }
    );
  };

  return (
    <Card className="border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl">
      <CardBody className="p-2 md:p-4 3xl:p-6">
        <div className="mb-6 flex items-center gap-2">
          <LinkIcon size={20} className="text-blue-400" />

          <h3 className="text-lg font-bold text-white">Available Platforms</h3>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Object.entries(platforms).map(([platformKey, platform]) => {
            const platformStatus = getPlatformStatus(platform);
            const requirements = formatRequirements(
              platform.verification,
              platform.detailedRequirements,
            );
            const priority = getPriorityLevel(platformKey);
            const isConnected = platformStatus.status === "verified";

            return (
              <Card
                key={platformKey}
                className={`border transition-all ${platform.borderColor} bg-gradient-to-br ${platform.gradientFrom} ${platform.gradientTo} ${
                  isConnected ? "opacity-75" : "hover:border-opacity-100"
                }`}
              >
                <CardBody className="p-2 md:p-4 3xl:p-6">
                  <div className="space-y-3 2xl:space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${platform.color}/20`}
                        >
                          <Image
                            width={24}
                            height={24}
                            src={platform.icon}
                            alt={platform.name}
                            className="rounded"
                          />
                        </div>

                        <div className="text-white">
                          <h4 className="text-lg font-bold">{platform.name}</h4>

                          <div className="hidden items-center gap-2 md:flex">
                            <Chip
                              size="sm"
                              variant="flat"
                              color={platformStatus.color}
                              startContent={
                                isConnected ? (
                                  <CheckCircleIcon size={12} />
                                ) : null
                              }
                            >
                              {platformStatus.text}
                            </Chip>

                            <Chip
                              size="sm"
                              variant="dot"
                              color={priority.color}
                            >
                              {priority.level} Priority
                            </Chip>
                          </div>
                        </div>
                      </div>

                      {!isConnected && (
                        <Button
                          size="sm"
                          variant="flat"
                          color="primary"
                          endContent={<ArrowRightIcon size={16} />}
                          onPress={() => onStartVerification(platformKey)}
                        >
                          Connect
                        </Button>
                      )}

                      {isConnected && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600/20">
                          <CheckCircleIcon
                            size={20}
                            className="text-green-400"
                          />
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-100">
                      {platform.description}
                    </p>

                    <div className="rounded-lg bg-gray-600/50 p-3">
                      <p className="mb-1 text-xs text-gray-100">
                        Why connect this platform?
                      </p>

                      <p className="text-sm text-gray-50">
                        {priority.description}
                      </p>
                    </div>

                    {requirements.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-200">
                          Verification Requirements
                        </p>

                        <div className="space-y-2">
                          {requirements
                            .filter((req) => req.status === "required")
                            .slice(0, 3)
                            .map((requirement, index) => {
                              const RequirementIcon = requirement.icon;
                              return (
                                <div
                                  key={index}
                                  className="flex items-center gap-3 rounded-lg border border-gray-700/50 bg-gray-900/50 p-2"
                                >
                                  <RequirementIcon
                                    size={16}
                                    className="flex-shrink-0 text-blue-400"
                                  />

                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-100">
                                      {requirement.text}
                                    </p>

                                    {requirement.description && (
                                      <p className="text-xs text-gray-200">
                                        {requirement.description}
                                      </p>
                                    )}
                                  </div>

                                  <Chip size="sm" color="primary" variant="dot">
                                    Required
                                  </Chip>
                                </div>
                              );
                            })}
                        </div>

                        {platform.detailedRequirements?.optional && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium uppercase tracking-wider text-gray-200">
                              Bonus Features
                            </p>

                            {platform.detailedRequirements.optional
                              .slice(0, 2)
                              .map((bonus, index) => {
                                const BonusIcon = getRequirementIcon(
                                  bonus.icon,
                                );
                                return (
                                  <div
                                    key={index}
                                    className="flex items-center gap-3 rounded-lg border border-yellow-500/20 bg-yellow-900/10 p-2"
                                  >
                                    <BonusIcon
                                      size={16}
                                      className="flex-shrink-0 text-yellow-400"
                                    />

                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-200">
                                        {bonus.name}
                                      </p>

                                      <p className="text-xs text-gray-300">
                                        {bonus.description}
                                      </p>
                                    </div>

                                    <Chip
                                      size="sm"
                                      color="warning"
                                      variant="dot"
                                    >
                                      {bonus.status === "bonus"
                                        ? "Bonus"
                                        : "Auto-detected"}
                                    </Chip>
                                  </div>
                                );
                              })}
                          </div>
                        )}

                        {requirements.length > 3 && (
                          <p className="text-xs text-gray-300">
                            +{requirements.length - 3} more requirements
                          </p>
                        )}
                      </div>
                    )}

                    <div className="rounded-lg border border-gray-700/50 bg-gray-900/50 p-3">
                      <p className="mb-2 text-xs font-medium text-gray-200">
                        Permissions Requested
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {platform.requiredScopes.map((scope, index) => (
                          <Chip
                            key={index}
                            size="sm"
                            variant="bordered"
                            className="text-xs"
                          >
                            {scope}
                          </Chip>
                        ))}
                      </div>

                      <p className="mt-2 text-xs text-gray-300">
                        Read-only access • No posting permissions • Secure OAuth
                        flow
                      </p>
                    </div>

                    {isConnected && (
                      <div className="rounded-lg border border-green-500/20 bg-green-900/20 p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <CheckCircleIcon
                            size={16}
                            className="text-green-400"
                          />

                          <p className="text-sm font-medium text-green-400">
                            Successfully Connected
                          </p>
                        </div>

                        <div className="space-y-1 text-xs text-gray-200">
                          <p>Connected as: {platform.displayValue}</p>
                          <p>Platform: {platform.name}</p>

                          {platform.detailedRequirements && (
                            <p>✓ All requirements verified</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 rounded-lg border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-600/20 flex h-8 w-8 items-center justify-center rounded-full">
              <ShieldIcon size={16} className="text-blue-400" />
            </div>

            <div>
              <h4 className="mb-2 font-medium text-blue-400">
                Enhanced Verification Process
              </h4>

              <div className="space-y-2 text-sm text-gray-200">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-400"></div>
                  <span>
                    Each platform has specific requirements for verification
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  <span>Required criteria must be met for connection</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>
                  <span>Bonus features provide higher verification scores</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                  <span>
                    All data is securely stored and can be disconnected anytime
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default SocialPlatformsList;
