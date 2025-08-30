"use client";

import Link from "next/link";
import { CheckCircle, AlertTriangle } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardBody, Avatar, Spinner, addToast } from "@heroui/react";

const formatNumber = (num) => {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

const XProfileCard = ({
  username,
  onProfileLoad,
  showStats = true,
  compact = false,
}) => {
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!username) return;

    setIsLoading(true);
    setError("");

    let headers = {};

    if (localStorage.getItem("neo-jwt")) {
      headers = {
        Authorization: `Bearer ${localStorage.getItem("neo-jwt")}`,
      };
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/socials/twitter/profile/${username}`,
        {
          headers,
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch profile");
      }

      const data = await response.json();

      setProfile(data.profileData);
      onProfileLoad?.(data.profileData);
    } catch (err) {
      setError(err.message);

      addToast({
        color: "danger",
        title: "Profile Load Failed",
        description: `Could not load @${username}: ${err.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [username, onProfileLoad]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (isLoading) {
    return (
      <Card className="border border-gray-600 bg-black/50">
        <CardBody className={compact ? "p-2" : "p-4"}>
          <div className="flex items-center space-x-3">
            <div
              className={`${compact ? "h-8 w-8" : "h-12 w-12"} animate-pulse rounded-full bg-gray-700`}
            />

            <div className="flex-1 space-y-2">
              <div className="h-4 animate-pulse rounded bg-gray-700" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-gray-700" />
            </div>
            <Spinner size="sm" color="primary" />
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error || !profile) {
    return (
      <Card className="border border-red-500/30 bg-red-900/20">
        <CardBody className={compact ? "p-2" : "p-4"}>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-400" />

            <span className="text-sm text-red-400">
              Could not load profile for @{username}
            </span>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Link
      target="_blank"
      className="group block"
      rel="noopener noreferrer"
      href={`https://x.com/${profile.username}`}
    >
      <Card className="border border-gray-500/30 bg-gray-700/20 transition-colors hover:bg-gray-700/50">
        <CardBody className={compact ? "p-2" : "p-3"}>
          <div className="flex items-center space-x-3">
            <Avatar
              alt={profile.name}
              size={compact ? "sm" : "md"}
              src={profile.profileImageUrl}
              className="hidden ring-2 ring-gray-600 transition-colors group-hover:ring-gray-500 sm:inline-block"
              fallback={
                <div className="font-semibold text-white">
                  {profile.name?.[0]?.toUpperCase()}
                </div>
              }
            />

            <div className="min-w-0 flex-1" aria-label="Profile Name">
              <div className="flex items-center space-x-1">
                <p
                  className={`font-medium text-gray-100 group-hover:text-white ${compact ? "text-sm" : ""}`}
                >
                  {profile.name}
                </p>

                {profile.verified && (
                  <CheckCircle
                    className={`${compact ? "h-3 w-3" : "h-4 w-4"} flex-shrink-0 text-blue-400`}
                  />
                )}
              </div>

              <p
                className={`text-gray-200 group-hover:text-white ${compact ? "text-xs" : "text-sm"}`}
              >
                @{profile.username}
              </p>
            </div>

            {showStats && (
              <div
                className={`hidden text-right text-gray-200 sm:block ${compact ? "text-xs" : "text-sm"}`}
                aria-label="Profile Stats"
              >
                <div>{formatNumber(profile.followersCount)} followers</div>
                <div>{formatNumber(profile.tweetsCount)} posts</div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
};

export default XProfileCard;
