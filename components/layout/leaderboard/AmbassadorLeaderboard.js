"use client";

import React from "react";

import TableHeader from "./TableHeader";
import AmbassadorRow from "./AmbassadorRow";

const CurrentUserSection = ({ currentUser, leaderboardType }) => {
  if (!currentUser) return null;

  return (
    <div className="mb-6 md:mb-8">
      <h2 className="mb-4 text-lg font-semibold text-gray-100 md:text-xl">
        Your Position
      </h2>

      <AmbassadorRow
        ambassador={currentUser}
        isCurrentUser={true}
        leaderboardType={leaderboardType}
      />
    </div>
  );
};

const LeaderboardSection = ({ ambassadors, leaderboardType }) => {
  const getSectionTitle = () => {
    if (leaderboardType === "all_time") {
      return "Top Ambassadors";
    } else {
      return `Top ${leaderboardType.charAt(0).toUpperCase() + leaderboardType.slice(1)}s`;
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-100 md:text-xl">
        {getSectionTitle()}
      </h2>
      <div className="space-y-2">
        {ambassadors.map((ambassador) => (
          <AmbassadorRow
            key={ambassador.ambassador_id}
            ambassador={ambassador}
            leaderboardType={leaderboardType}
          />
        ))}
      </div>
    </div>
  );
};

const LoadMoreButton = ({ onLoadMore, isLoading, hasMore }) => {
  if (!hasMore) {
    return (
      <div className="py-4 text-center">
        <p className="text-gray-400">You've reached the end</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-6">
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className="rounded-xl border border-gray-600/30 bg-gray-700/30 px-8 py-3 text-gray-100 transition-colors duration-200 hover:bg-gray-600/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Loading..." : "Load More"}
      </button>
    </div>
  );
};

const AmbassadorLeaderboard = ({
  data = [],
  hasMore = false,
  onLoadMore = null,
  isLoading = false,
  currentAmbassadorId = null,
  leaderboardType = "all_time",
}) => {
  // Find current user in the provided data
  const currentUser = data.find(
    (amb) => amb.ambassador_id === currentAmbassadorId,
  );
  const otherAmbassadors = data.filter(
    (amb) => amb.ambassador_id !== currentAmbassadorId,
  );

  return (
    <div className="w-full pr-3">
      <TableHeader leaderboardType={leaderboardType} />

      <CurrentUserSection
        currentUser={currentUser}
        leaderboardType={leaderboardType}
      />

      <LeaderboardSection
        ambassadors={otherAmbassadors}
        leaderboardType={leaderboardType}
      />

      {onLoadMore && (
        <LoadMoreButton
          onLoadMore={onLoadMore}
          isLoading={isLoading}
          hasMore={hasMore}
        />
      )}
    </div>
  );
};

export default AmbassadorLeaderboard;
