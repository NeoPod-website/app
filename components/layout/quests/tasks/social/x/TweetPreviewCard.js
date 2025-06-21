import {
  Hash,
  Play,
  Heart,
  AtSign,
  Repeat2,
  Calendar,
  ExternalLink,
  MessageCircle,
  AlertTriangle,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { Chip, Card, CardBody, addToast } from "@heroui/react";
import React, { useState, useEffect, useCallback } from "react";

import XProfileCard from "./XProfileCard";

const formatNumber = (num) => {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return "Unknown date";
  }
};

const TweetPreview = ({ tweetId, onTweetLoad }) => {
  const [error, setError] = useState("");
  const [tweetData, setTweetData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTweet = useCallback(async () => {
    if (!tweetId) return;

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
        `${process.env.NEXT_PUBLIC_API_URL}/socials/twitter/tweet/${tweetId}`,
        {
          headers,
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch tweet details");
      }

      const data = await response.json();

      setTweetData(data.tweetData || data);
      onTweetLoad?.(data.tweetData || data);
    } catch (err) {
      setError(err.message);

      addToast({
        color: "danger",
        title: "Tweet Load Failed",
        description: `Could not load tweet: ${err.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [tweetId, onTweetLoad]);

  useEffect(() => {
    fetchTweet();
  }, [fetchTweet]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Profile loading skeleton */}
        <Card className="border border-gray-600 bg-black/50">
          <CardBody className="p-2">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-700" />
              <div className="flex-1 space-y-1">
                <div className="h-3 animate-pulse rounded bg-gray-700" />
                <div className="h-2 w-2/3 animate-pulse rounded bg-gray-700" />
              </div>
              <div className="space-y-1 text-right">
                <div className="h-2 w-12 animate-pulse rounded bg-gray-700" />
                <div className="h-2 w-8 animate-pulse rounded bg-gray-700" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Tweet content loading skeleton */}
        <Card className="border border-gray-600 bg-black/50">
          <CardBody className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-3 w-20 animate-pulse rounded bg-gray-700" />
                <div className="h-3 w-16 animate-pulse rounded bg-gray-700" />
              </div>
              <div className="space-y-2">
                <div className="h-4 animate-pulse rounded bg-gray-700" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-700" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-700" />
              </div>
              <div className="flex justify-between border-t border-gray-700 pt-3">
                <div className="flex space-x-4">
                  <div className="h-3 w-8 animate-pulse rounded bg-gray-700" />
                  <div className="h-3 w-8 animate-pulse rounded bg-gray-700" />
                  <div className="h-3 w-8 animate-pulse rounded bg-gray-700" />
                </div>
                <div className="h-6 w-16 animate-pulse rounded bg-gray-700" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border border-red-500/30 bg-red-900/20">
        <CardBody className="p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-400" />

            <span className="text-sm text-red-400">{error}</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!tweetData) return null;

  return (
    <div className="space-y-4">
      {tweetData?.username && (
        <XProfileCard
          compact={true}
          showStats={true}
          username={tweetData.username}
        />
      )}

      <Card className="border border-gray-500/30 bg-gradient-to-br from-gray-700/10 to-gray-700/5">
        <CardBody className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(tweetData.createdAt)}</span>
            </div>

            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={`https://x.com/${tweetData.username}/status/${tweetData.id}`}
              className="text-xs text-blue-400 transition-colors hover:text-blue-300"
            >
              View Original
            </Link>
          </div>

          <div className="text-sm leading-relaxed text-gray-100">
            {tweetData.text}
          </div>

          {(tweetData.hashtags?.length > 0 ||
            tweetData.mentions?.length > 0) && (
            <div className="space-y-2">
              {tweetData.hashtags?.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  <Hash className="h-3 w-3 text-blue-400" />

                  {tweetData.hashtags.slice(0, 5).map((hashtag, index) => (
                    <Chip
                      key={index}
                      size="sm"
                      variant="flat"
                      className="bg-blue-900/30 text-blue-300"
                    >
                      {hashtag}
                    </Chip>
                  ))}

                  {tweetData.hashtags.length > 5 && (
                    <span className="text-xs text-gray-500">
                      +{tweetData.hashtags.length - 5} more
                    </span>
                  )}
                </div>
              )}

              {tweetData.mentions?.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  <AtSign className="h-3 w-3 text-green-400" />
                  {tweetData.mentions.slice(0, 3).map((mention, index) => (
                    <Chip
                      key={index}
                      size="sm"
                      variant="flat"
                      className="bg-green-900/30 text-green-300"
                    >
                      @{mention.username}
                    </Chip>
                  ))}
                  {tweetData.mentions.length > 3 && (
                    <span className="text-xs text-gray-300">
                      +{tweetData.mentions.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {(tweetData.photos?.length > 0 || tweetData.videos?.length > 0) && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs text-gray-300">
                <ImageIcon className="h-3 w-3" />

                <span>
                  {tweetData.photos?.length > 0 &&
                    `${tweetData.photos.length} image${tweetData.photos.length > 1 ? "s" : ""}`}
                  {tweetData.photos?.length > 0 &&
                    tweetData.videos?.length > 0 &&
                    ", "}
                  {tweetData.videos?.length > 0 &&
                    `${tweetData.videos.length} video${tweetData.videos.length > 1 ? "s" : ""}`}
                </span>
              </div>

              {tweetData.photos?.length > 0 && (
                <div
                  className={`grid gap-2 ${
                    tweetData.photos.length === 1
                      ? "grid-cols-1"
                      : tweetData.photos.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-2"
                  }`}
                >
                  {tweetData.photos.slice(0, 2).map((photo, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-lg"
                    >
                      <img
                        src={photo.url}
                        alt={`Tweet image ${index + 1}`}
                        className="h-32 w-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />

                      {index === 2 && tweetData.photos.length > 3 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/70 font-semibold text-white">
                          +{tweetData.photos.length - 3} more
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {tweetData.videos?.length > 0 && (
                <div className="grid grid-cols-1 gap-2">
                  {tweetData.videos.slice(0, 1).map((video, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg bg-gray-800 p-4"
                    >
                      <div className="flex items-center space-x-2 text-blue-400">
                        <Play className="h-4 w-4" />
                        <span className="text-sm">Video content available</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-gray-700 pt-3">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-1 transition-colors hover:text-red-400">
                <Heart className="h-4 w-4" />
                <span>{formatNumber(tweetData.likeCount)}</span>
              </div>

              <div className="flex items-center space-x-1 transition-colors hover:text-green-400">
                <Repeat2 className="h-4 w-4" />
                <span>{formatNumber(tweetData.retweetCount)}</span>
              </div>

              <div className="flex items-center space-x-1 transition-colors hover:text-blue-400">
                <MessageCircle className="h-4 w-4" />
                <span>{formatNumber(tweetData.replyCount)}</span>
              </div>
            </div>

            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={`https://x.com/${tweetData.username}/status/${tweetData.id}`}
              className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-100 transition-colors hover:border-gray-100 hover:bg-gray-700 hover:text-white"
            >
              View on X <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TweetPreview;
