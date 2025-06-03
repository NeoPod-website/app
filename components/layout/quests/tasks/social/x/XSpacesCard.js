"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const XSpacesCard = ({ spaceUrl, task }) => {
  const [now, setNow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [spaceData, setSpaceData] = useState(null);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setNow(new Date());
  }, []);

  useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        // TODO: Replace with actual Twitter API call
        // Extract space ID from URL and fetch data
        // const spaceId = extractSpaceId(spaceUrl);
        // const response = await fetch(`/api/twitter/space/${spaceId}`);
        // const data = await response.json();

        // Generate random data for demo
        const isLive = Math.random() > 0.6;
        const isFuture = Math.random() > 0.5;
        const baseDate = new Date();

        let spaceDate;
        if (isLive) {
          spaceDate = new Date(baseDate.getTime() - Math.random() * 3600000); // Started up to 1 hour ago
        } else if (isFuture) {
          spaceDate = new Date(baseDate.getTime() + Math.random() * 86400000); // Up to 1 day in future
        } else {
          spaceDate = new Date(baseDate.getTime() - Math.random() * 86400000); // Up to 1 day in past
        }

        setSpaceData({
          title: "Sample Twitter Space - Web3 Discussion",
          date: spaceDate.toISOString(),
          isLive: isLive && !isFuture,
          listeners: isLive ? Math.floor(Math.random() * 1000) + 50 : 0,
          hosts: [
            {
              name: "Host User",
              avatar: "/neo-pod-logo.png",
            },
            {
              name: "Co-Host",
              avatar: "/neo-pod-logo.png",
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching space data:", error);
        setLoading(false);
      }
    };

    if (spaceUrl) {
      fetchSpaceData();
    }
  }, [spaceUrl]);

  useEffect(() => {
    if (spaceData?.date) {
      try {
        const date = new Date(spaceData.date);
        setFormattedDate(date.toLocaleString());
      } catch {
        setFormattedDate(spaceData.date);
      }
    }
  }, [spaceData?.date]);

  const renderStatusBadge = () => {
    if (!spaceData) return null;

    if (spaceData.isLive) {
      return (
        <span className="w-fit rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
          LIVE
        </span>
      );
    }

    const spaceDate = spaceData.date ? new Date(spaceData.date) : null;

    if (now && spaceDate && spaceDate > now) {
      return (
        <span className="w-fit rounded-full bg-sky-500 px-2 py-1 text-xs font-bold text-white">
          SCHEDULED
        </span>
      );
    }

    return (
      <span className="w-fit rounded-full bg-gray-500 px-2 py-1 text-xs font-bold text-white">
        ENDED
      </span>
    );
  };

  if (loading) {
    return (
      <div className="mb-3 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="h-6 w-16 animate-pulse rounded-full bg-gray-600"></div>
              <div className="mt-2 h-6 w-48 animate-pulse rounded bg-gray-600"></div>
            </div>

            <div className="h-4 w-24 animate-pulse rounded bg-gray-600"></div>
          </div>

          <div className="h-4 w-20 animate-pulse rounded bg-gray-600"></div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-600"></div>
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-600"></div>
            <div className="h-4 w-32 animate-pulse rounded bg-gray-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!spaceData) {
    return (
      <div className="mb-3 rounded-lg border border-red-700 bg-red-900/20 p-4">
        <p className="text-sm text-red-400">Failed to load space data</p>
      </div>
    );
  }

  return (
    <div className="mb-3 rounded-lg border border-neutral-700 bg-neutral-800 p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            {renderStatusBadge()}
            <h3 className="mt-2 text-lg font-bold text-gray-100">
              {spaceData.title || "Untitled Space"}
            </h3>
          </div>

          <div className="text-sm text-gray-300">
            {formattedDate || "Date not available"}
          </div>
        </div>

        <div className="text-sm text-gray-300">
          {spaceData.listeners
            ? `${spaceData.listeners.toLocaleString()} listening`
            : "0 listening"}
        </div>

        <div className="mt-2 flex items-center">
          <div className="mr-2 flex -space-x-2">
            {Array.isArray(spaceData.hosts) &&
              spaceData.hosts.slice(0, 3).map((host, index) => (
                <div
                  key={index}
                  className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-gray-200"
                >
                  {host.avatar ? (
                    <Image
                      src={host.avatar}
                      alt={host.name || `Host ${index + 1}`}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = "/neo-pod-logo.png";
                        e.target.alt = "Avatar placeholder";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-300 text-gray-600">
                      {(host.name?.charAt(0) || "?").toUpperCase()}
                    </div>
                  )}
                </div>
              ))}
          </div>

          <div className="text-sm text-gray-300">
            Hosted by{" "}
            {Array.isArray(spaceData.hosts) && spaceData.hosts.length > 0
              ? spaceData.hosts[0].name || "Anonymous"
              : "Unknown host"}
            {Array.isArray(spaceData.hosts) && spaceData.hosts.length > 1
              ? ` + ${spaceData.hosts.length - 1} more`
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default XSpacesCard;
