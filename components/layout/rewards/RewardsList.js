"use client";

import React from "react";
import { Loader2 } from "lucide-react";

import RewardRow from "./RewardRow";
import WrapperContainer from "@/components/common/WrapperContainer";

const LoadingState = () => (
  <div className="flex h-64 items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
  </div>
);

const EmptyState = ({ hasActiveFilters, resetFilters }) => (
  <div className="flex h-64 flex-col items-center justify-center space-y-4">
    <p className="text-lg font-medium text-gray-300">
      {hasActiveFilters
        ? "No rewards found with current filters"
        : "No rewards found"}
    </p>

    {hasActiveFilters && (
      <button
        onClick={resetFilters}
        className="rounded-lg bg-gray-600/30 px-6 py-2 text-sm font-medium text-gray-100 transition-colors hover:bg-gray-600/50"
      >
        Clear Filters
      </button>
    )}
  </div>
);

const ErrorState = ({ error }) => (
  <div className="flex h-64 items-center justify-center">
    <div className="text-center">
      <p className="text-lg font-medium text-red-400">Error loading rewards</p>
      <p className="mt-2 text-sm text-gray-400">{error}</p>
    </div>
  </div>
);

const LoadMoreButton = ({ onLoadMore, isLoading, hasMore }) => {
  if (!hasMore) {
    return (
      <div className="py-4 text-center">
        <p className="text-sm text-gray-400">You've reached the end</p>
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

const RewardsList = ({
  rewards,
  loading,
  error,
  pagination,
  onLoadMore,
  resetFilters,
  hasActiveFilters,
}) => {
  if (loading && rewards.length === 0) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (rewards.length === 0) {
    return (
      <EmptyState
        hasActiveFilters={hasActiveFilters}
        resetFilters={resetFilters}
      />
    );
  }

  return (
    <WrapperContainer scrollable={true} className="p-4">
      <div className="thin-scrollbar flex-1 space-y-3 overflow-y-auto pr-2">
        {rewards.map((reward) => (
          <RewardRow key={reward.claim_id} reward={reward} />
        ))}

        {onLoadMore && (
          <LoadMoreButton
            onLoadMore={onLoadMore}
            isLoading={loading}
            hasMore={pagination.hasMore}
          />
        )}
      </div>
    </WrapperContainer>
  );
};

export default RewardsList;
