"use client";

import Link from "next/link";
import { Avatar } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { Heart, Repeat, MessageCircle } from "lucide-react";

const XTweetCard = ({ tweetUrl, task }) => {
  const [loading, setLoading] = useState(true);
  const [tweetData, setTweetData] = useState(null);

  useEffect(() => {
    const fetchTweetData = async () => {
      try {
        // TODO: Replace with actual Twitter API call
        // Extract tweet ID from URL and fetch data
        // const tweetId = extractTweetId(tweetUrl);
        // const response = await fetch(`/api/twitter/tweet/${tweetId}`);
        // const data = await response.json();

        // Placeholder data structure for now
        const randomStats = {
          replies: Math.floor(Math.random() * 100),
          retweets: Math.floor(Math.random() * 500),
          likes: Math.floor(Math.random() * 1000),
        };

        setTweetData({
          name: "Sample User",
          handle: "sample_user",
          time: "2h",
          profileImage: "/neo-pod-logo.png",
          content:
            "This is a sample tweet that demonstrates the tweet card component. In production, this will show real tweet data fetched from Twitter's API.",
          ...randomStats,
          verified: Math.random() > 0.5,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tweet data:", error);
        setLoading(false);
      }
    };

    if (tweetUrl) {
      fetchTweetData();
    }
  }, [tweetUrl]);

  if (loading) {
    return (
      <div className="mb-3 rounded-xl border border-neutral-700 bg-neutral-800 p-3">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-600"></div>

          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-4 w-20 animate-pulse rounded bg-gray-600"></div>
              <div className="h-3 w-16 animate-pulse rounded bg-gray-600"></div>
            </div>

            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-gray-600"></div>
              <div className="h-3 w-3/4 animate-pulse rounded bg-gray-600"></div>
            </div>

            <div className="mt-3 flex justify-between">
              <div className="h-4 w-8 animate-pulse rounded bg-gray-600"></div>
              <div className="h-4 w-8 animate-pulse rounded bg-gray-600"></div>
              <div className="h-4 w-8 animate-pulse rounded bg-gray-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tweetData) {
    return (
      <div className="mb-3 rounded-xl border border-red-700 bg-red-900/20 p-3">
        <p className="text-sm text-red-400">Failed to load tweet data</p>
      </div>
    );
  }

  return (
    <Link href={tweetUrl}>
      <div className="mb-3 flex items-start gap-3 rounded-xl border border-neutral-700 bg-neutral-800 p-3">
        <Avatar
          src={tweetData.profileImage}
          alt={tweetData.name}
          className="h-8 w-8 rounded-full"
        />

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <p className="font-medium text-white">{tweetData.name}</p>

              {tweetData.verified && <span className="text-blue-400">✓</span>}
            </div>

            <p className="text-sm text-gray-200">@{tweetData.handle}</p>

            <span className="text-xs text-gray-300">• {tweetData.time}</span>
          </div>

          <p className="my-2 text-gray-200">{tweetData.content}</p>

          <div className="mt-3 flex items-center justify-between text-gray-400">
            <div className="flex cursor-pointer items-center gap-1 text-blue-400 transition-colors">
              <MessageCircle size={16} />

              <span className="text-xs">{tweetData.replies}</span>
            </div>

            <div className="flex cursor-pointer items-center gap-1 text-green-400 transition-colors">
              <Repeat size={16} />

              <span className="text-xs">{tweetData.retweets}</span>
            </div>

            <div className="flex cursor-pointer items-center gap-1 text-red-400 transition-colors">
              <Heart size={16} />

              <span className="text-xs">{tweetData.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default XTweetCard;
