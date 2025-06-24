"use client";

import React from "react";
import {
  Users2Icon,
  RefreshCwIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  EyeIcon,
} from "lucide-react";
import { Card, CardBody, Button, Chip } from "@heroui/react";

const SocialsOverview = ({
  totalReach,
  verificationCount,
  totalPlatforms,
  lastUpdated,
  onRefresh,
  isRefreshing = false,
}) => {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getVerificationStatus = () => {
    if (verificationCount === 0) {
      return { color: "warning", text: "No Verifications", icon: Users2Icon };
    }
    if (verificationCount < 3) {
      return {
        color: "primary",
        text: "Basic Verification",
        icon: ShieldCheckIcon,
      };
    }
    if (verificationCount < 5) {
      return {
        color: "success",
        text: "Advanced Verification",
        icon: ShieldCheckIcon,
      };
    }
    return {
      color: "success",
      text: "Full Verification",
      icon: ShieldCheckIcon,
    };
  };

  const verificationStatus = getVerificationStatus();
  const StatusIcon = verificationStatus.icon;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20">
              <Users2Icon size={24} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Social Verifications
              </h2>
              <div className="flex items-center gap-2">
                <Chip
                  color={verificationStatus.color}
                  variant="flat"
                  size="sm"
                  startContent={<StatusIcon size={12} />}
                >
                  {verificationStatus.text}
                </Chip>
                {lastUpdated && (
                  <span className="text-xs text-gray-400">
                    Updated {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="flat"
            size="sm"
            startContent={<RefreshCwIcon size={16} />}
            onClick={onRefresh}
            isLoading={isRefreshing}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Total Reach */}
        <Card className="border border-green-500/20 bg-gradient-to-br from-green-900/20 to-blue-900/20 backdrop-blur-xl">
          <CardBody className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600/20">
                  <EyeIcon size={20} className="text-green-400" />
                </div>
                <h3 className="text-sm font-medium text-white">Total Reach</h3>
              </div>
              <TrendingUpIcon size={16} className="text-green-400" />
            </div>

            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-white">
                {formatNumber(totalReach)}
              </div>
              <p className="text-sm text-gray-400">Combined followers</p>
            </div>
          </CardBody>
        </Card>

        {/* Verified Accounts */}
        <Card className="border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl">
          <CardBody className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20">
                  <ShieldCheckIcon size={20} className="text-purple-400" />
                </div>
                <h3 className="text-sm font-medium text-white">Verified</h3>
              </div>
              <div className="text-sm text-purple-400">
                {Math.round((verificationCount / totalPlatforms) * 100)}%
              </div>
            </div>

            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-white">
                {verificationCount}
              </div>
              <p className="text-sm text-gray-400">
                of {totalPlatforms} platforms
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Verification Progress */}
        <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl">
          <CardBody className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600/20 flex h-10 w-10 items-center justify-center rounded-xl">
                  <Users2Icon size={20} className="text-blue-400" />
                </div>
                <h3 className="text-sm font-medium text-white">Progress</h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Completion</span>
                <span className="font-medium text-white">
                  {Math.round((verificationCount / totalPlatforms) * 100)}%
                </span>
              </div>

              <div className="h-2 w-full rounded-full bg-gray-700">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-500"
                  style={{
                    width: `${(verificationCount / totalPlatforms) * 100}%`,
                  }}
                ></div>
              </div>

              <p className="text-xs text-gray-400">
                {totalPlatforms - verificationCount} platforms remaining
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Ambassador Benefits */}
      {verificationCount > 0 && (
        <Card className="border border-yellow-500/20 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-xl">
          <CardBody className="p-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-600/20">
                <TrendingUpIcon size={16} className="text-yellow-400" />
              </div>
              <div>
                <h4 className="mb-2 font-medium text-yellow-400">
                  Ambassador Benefits
                </h4>
                <div className="grid grid-cols-1 gap-3 text-sm text-gray-300 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Higher reward tiers unlocked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500 h-2 w-2 rounded-full"></div>
                    <span>Exclusive campaign access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <span>Priority support and updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-pink-500 h-2 w-2 rounded-full"></div>
                    <span>Advanced analytics dashboard</span>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default SocialsOverview;
