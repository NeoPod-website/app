"use client";

import { useState, useCallback, useEffect } from "react";

import RewardsList from "./RewardsList";
import RewardsStatistics from "./RewardsStatistics";
import RewardsFilterPanel from "./RewardsFilterPanel";

import FilterIndicator from "@/components/common/filter/FilterIndicator";

const RewardsWithFilter = ({
  initialRewards,
  initialPagination,
  initialStatistics,
}) => {
  const [sortFilter, setSortFilter] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rewards, setRewards] = useState(initialRewards || []);
  const [statistics, setStatistics] = useState(initialStatistics || {});

  const [pagination, setPagination] = useState(
    initialPagination || {
      hasMore: false,
      nextPageToken: null,
      limit: 20,
      sortOrder: "desc",
    },
  );

  const hasActiveFilters = statusFilter !== "all" || sortFilter !== "desc";

  const activeFiltersCount =
    (statusFilter !== "all" ? 1 : 0) + (sortFilter !== "desc" ? 1 : 0);

  const fetchRewards = useCallback(
    async (loadMore = false) => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();

        if (statusFilter !== "all") {
          queryParams.append("status", statusFilter);
        }

        queryParams.append("sortOrder", sortFilter);
        queryParams.append("limit", "20");

        if (loadMore && pagination.nextPageToken) {
          queryParams.append("lastEvaluatedKey", pagination.nextPageToken);
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/rewards?${queryParams.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data } = await response.json();

        if (loadMore) {
          setRewards((prev) => [...prev, ...(data.claims || [])]);
        } else {
          setRewards(data.claims || []);
        }

        setStatistics(data.statistics || {});
        setPagination(
          data.pagination || {
            hasMore: false,
            nextPageToken: null,
            limit: 20,
            sortOrder: sortFilter,
          },
        );
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch rewards:", err);
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, sortFilter, pagination.nextPageToken],
  );

  // Fetch rewards when filters change
  useEffect(() => {
    fetchRewards();
  }, [statusFilter, sortFilter]);

  const handleLoadMore = useCallback(() => {
    if (pagination.hasMore && !loading) {
      fetchRewards(true);
    }
  }, [pagination.hasMore, loading, fetchRewards]);

  const resetFilters = useCallback(() => {
    setStatusFilter("all");
    setSortFilter("desc");
  }, []);

  return (
    <div className="flex flex-1 flex-col space-y-4 overflow-hidden">
      <div className="flex items-center justify-between gap-4 rounded-xl border-t border-gray-400 bg-black/60 px-4 py-2.5 backdrop-blur-sm xl:px-6 3xl:px-8">
        <h2 className="text-base capitalize text-gray-100 xl:text-lg">
          Rewards
        </h2>

        <div className="flex items-center gap-4">
          <FilterIndicator
            hasActiveFilters={hasActiveFilters}
            activeFiltersCount={activeFiltersCount}
          />
        </div>
      </div>

      <RewardsStatistics statistics={statistics} loading={loading} />

      <RewardsFilterPanel
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortFilter={sortFilter}
        setSortFilter={setSortFilter}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
        disabled={loading}
      />

      <RewardsList
        error={error}
        rewards={rewards}
        loading={loading}
        pagination={pagination}
        totalRewards={rewards.length}
        onLoadMore={handleLoadMore}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
};

export default RewardsWithFilter;
