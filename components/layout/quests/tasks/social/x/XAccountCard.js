"use client";

import React, { useState, useEffect } from "react";
import { Button, Avatar } from "@heroui/react";
import Link from "next/link";

const XAccountCard = ({ username, task }) => {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        // TODO: Replace with actual Twitter API call
        // const response = await fetch(`/api/twitter/user/${username}`);
        // const data = await response.json();

        // Placeholder data structure for now
        setAccountData({
          name: `${username}`,
          handle: username,
          verified: false,
          profileImage: "/neo-pod-logo.png",
          followers: Math.floor(Math.random() * 10000),
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching account data:", error);
        setLoading(false);
      }
    };

    if (username) {
      fetchAccountData();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="mb-3 rounded-xl border border-neutral-700 bg-neutral-800 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-600"></div>

            <div>
              <div className="mb-1 h-4 w-24 animate-pulse rounded bg-gray-600"></div>
              <div className="h-3 w-16 animate-pulse rounded bg-gray-600"></div>
            </div>
          </div>

          <div className="h-8 w-16 animate-pulse rounded bg-gray-600"></div>
        </div>
      </div>
    );
  }

  if (!accountData) {
    return (
      <div className="mb-3 rounded-xl border border-red-700 bg-red-900/20 p-3">
        <p className="text-sm text-red-400">
          Failed to load account data for @{username}
        </p>
      </div>
    );
  }

  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href={`https://x.com/${username}`}
    >
      <div className="mb-3 flex items-center justify-between rounded-xl border border-neutral-700 bg-neutral-800 p-3">
        <div className="flex items-center gap-3">
          <Avatar
            alt={accountData.name}
            src={accountData.profileImage}
            className="h-10 w-10 rounded-full"
          />

          <div>
            <div className="flex items-center gap-1">
              <p className="font-medium text-white">{accountData.name}</p>

              {accountData.verified && <span className="text-blue-400">✓</span>}
            </div>

            <p className="text-sm text-gray-100">@{accountData.handle}</p>
            {accountData.followers > 0 && (
              <p className="text-xs text-gray-200">
                {accountData.followers.toLocaleString()} followers
              </p>
            )}
          </div>
        </div>

        <Button size="sm" className="bg-gray-600 hover:bg-gray-700">
          Follow
        </Button>
      </div>
    </Link>
  );
};

export default XAccountCard;
