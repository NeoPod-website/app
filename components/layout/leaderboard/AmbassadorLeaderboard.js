"use client";

import React, { memo, useMemo } from "react";

import TableHeader from "./TableHeader";
import AmbassadorRow from "./AmbassadorRow";

const CurrentUserSection = memo(({ currentUser, leaderboardType }) => {
  if (!currentUser) return null;

  return (
    <div className="mb-6 3xl:mb-8">
      <h2 className="mb-3 text-lg font-semibold text-gray-100 md:text-xl lg:mb-4">
        Your Position
      </h2>

      <AmbassadorRow
        ambassador={currentUser}
        isCurrentUser={true}
        leaderboardType={leaderboardType}
      />
    </div>
  );
});

CurrentUserSection.displayName = "CurrentUserSection";

const LeaderboardSection = memo(({ ambassadors, leaderboardType }) => {
  const sectionTitle = useMemo(() => {
    if (leaderboardType === "all_time") {
      return "Top Ambassadors";
    }

    return `Top ${leaderboardType.charAt(0).toUpperCase() + leaderboardType.slice(1)}s`;
  }, [leaderboardType]);

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-gray-100 md:text-xl lg:mb-4">
        {sectionTitle}
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
});

LeaderboardSection.displayName = "LeaderboardSection";

const LoadMoreButton = memo(({ onLoadMore, isLoading, hasMore }) => {
  if (!hasMore) {
    return (
      <div className="py-4 text-center">
        <p className="text-sm text-gray-300 md:text-base">
          You've reached the end
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-6">
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className="rounded-xl border border-gray-600/30 bg-gray-700/30 px-8 py-3 text-gray-100 transition-colors duration-200 hover:bg-gray-600/50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={
          isLoading ? "Loading more ambassadors" : "Load more ambassadors"
        }
      >
        {isLoading ? "Loading..." : "Load More"}
      </button>
    </div>
  );
});

LoadMoreButton.displayName = "LoadMoreButton";

const AmbassadorLeaderboard = ({
  data = [],
  hasMore = false,
  onLoadMore = null,
  isLoading = false,
  currentAmbassadorId = null,
  leaderboardType = "all_time",
}) => {
  const { currentUser, otherAmbassadors } = useMemo(() => {
    const currentUser = data.find(
      (amb) => amb.ambassador_id === currentAmbassadorId,
    );

    const otherAmbassadors = data.filter(
      (amb) => amb.ambassador_id !== currentAmbassadorId,
    );

    return { currentUser, otherAmbassadors };
  }, [data, currentAmbassadorId]);

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
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={onLoadMore}
        />
      )}
    </div>
  );
};

export default memo(AmbassadorLeaderboard);
