"use client";

import { addToast } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback, useMemo, Suspense } from "react";

import {
  appendPods,
  setLoading,
  initializePods,
} from "@/redux/slice/podsSlice";

import PodGrid from "@/components/layout/pods/filter/PodGrid";
import PodFilterPanel from "@/components/layout/pods/filter/PodFilterPanel";
import PodFilterHeader from "@/components/layout/pods/filter/PodFilterHeader";

const LoadMorePods = ({ initialPods, initialLastKey, initialHasMore }) => {
  const dispatch = useDispatch();

  const { pods, lastKey, hasMore, isLoading } = useSelector(
    (state) => state.pods,
  );

  const [nameFilter, setNameFilter] = useState("");
  const [adminFilter, setAdminFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isServerSearching, setIsServerSearching] = useState(false);
  const [debouncedNameFilter, setDebouncedNameFilter] = useState("");

  // Track if any filter is applied
  const hasActiveFilters = nameFilter || statusFilter || adminFilter;
  const activeFiltersCount =
    (nameFilter ? 1 : 0) + (statusFilter ? 1 : 0) + (adminFilter ? 1 : 0);

  // Initialize pods on component mount - only once
  useEffect(() => {
    if (!isInitialized && initialPods) {
      const initialData = {
        pods: initialPods || [],
        lastKey: initialLastKey ? JSON.stringify(initialLastKey) : null,
        hasMore: initialHasMore && initialPods?.length > 0,
      };

      dispatch(initializePods(initialData));
      setIsInitialized(true);
    }
  }, [dispatch, initialPods, initialLastKey, initialHasMore, isInitialized]);

  // Debounce name filter changes to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNameFilter(nameFilter);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [nameFilter]);

  // Trigger search when debounced name filter changes
  useEffect(() => {
    if (!isInitialized) return;

    if (debouncedNameFilter) {
      // Perform server-side search when there's a search term
      performServerSearch(debouncedNameFilter);
    } else {
      // When search is empty, show all pods by fetching initial data
      performResetToInitial();
    }
  }, [debouncedNameFilter, isInitialized]);

  /**
   * Performs a server-side search for pods based on the provided search term
   * @param {string} searchTerm - The name filter to search for
   */
  const performServerSearch = async (searchTerm) => {
    if (!searchTerm) return;

    try {
      setIsServerSearching(true);
      dispatch(setLoading(true));

      // Build the search query
      let queryParams = new URLSearchParams();

      queryParams.append("limit", "20"); // Increased limit for better search coverage
      queryParams.append("name", searchTerm);

      const url = `${process.env.NEXT_PUBLIC_API_URL}/pods?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        const searchResults = data.data.pods || [];

        // Update hasMore flag
        const effectiveHasMore =
          data.data.pagination.hasMore && searchResults.length > 0;

        const newLastKey =
          effectiveHasMore && data.data.pagination.lastEvaluatedKey
            ? JSON.stringify(data.data.pagination.lastEvaluatedKey)
            : null;

        // Replace current pods with search results
        dispatch(
          initializePods({
            pods: searchResults,
            lastKey: newLastKey,
            hasMore: effectiveHasMore,
          }),
        );
      } else {
        throw new Error(data.message || "Failed to search pods");
      }
    } catch (error) {
      addToast({
        color: "danger",
        title: "Error searching pods",
        description: error.message || "Please try again",
      });
    } finally {
      setIsServerSearching(false);
      dispatch(setLoading(false));
    }
  };

  /**
   * Fetches more pods with the current search parameters (pagination)
   */
  const fetchMorePods = useCallback(async () => {
    if (isLoading || !hasMore || !lastKey) return;

    try {
      dispatch(setLoading(true));

      // Build the pagination query
      let queryParams = new URLSearchParams();
      queryParams.append("limit", "9"); // Standard pagination limit
      queryParams.append("startKey", lastKey);

      // Include current name filter if any
      if (debouncedNameFilter) {
        queryParams.append("name", debouncedNameFilter);
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/pods?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        const newPods = data.data.pods || [];

        // Handle empty results case
        if (newPods.length === 0) {
          dispatch(
            appendPods({
              pods: [],
              lastKey: null,
              hasMore: false,
            }),
          );

          addToast({
            color: "default",
            title: "No more pods available",
            description: "You've reached the end of results",
          });
          return;
        }

        // Update hasMore flag
        const effectiveHasMore =
          data.data.pagination.hasMore && newPods.length > 0;

        const newLastKey =
          effectiveHasMore && data.data.pagination.lastEvaluatedKey
            ? JSON.stringify(data.data.pagination.lastEvaluatedKey)
            : null;

        // Update pods in state - always append for load more
        dispatch(
          appendPods({
            pods: newPods,
            lastKey: newLastKey,
            hasMore: effectiveHasMore,
          }),
        );
      } else {
        throw new Error(data.message || "Failed to load pods");
      }
    } catch (error) {
      addToast({
        color: "danger",
        title: "Error loading more pods",
        description: error.message || "Please try again",
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, hasMore, isLoading, lastKey, debouncedNameFilter, addToast]);

  /**
   * Resets all filters and reloads initial data if necessary
   */
  const resetFilters = useCallback(() => {
    setNameFilter("");
    setStatusFilter("");
    setAdminFilter("");

    // If we had any name filter (server search), reload initial data
    if (debouncedNameFilter) {
      // Reset to original data by fetching without filters
      performResetToInitial();
    }
  }, [debouncedNameFilter]);

  /**
   * Resets to initial data by fetching the first page with no filters
   * Called when search is cleared or filters are reset
   */
  const performResetToInitial = async () => {
    try {
      setIsServerSearching(true);
      dispatch(setLoading(true));

      // Fetch first page with no filters
      const queryParams = new URLSearchParams();
      queryParams.append("limit", "9");

      const url = `${process.env.NEXT_PUBLIC_API_URL}/pods?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        const pods = data.data.pods || [];

        // Update hasMore flag
        const effectiveHasMore =
          data.data.pagination.hasMore && pods.length > 0;

        const newLastKey =
          effectiveHasMore && data.data.pagination.lastEvaluatedKey
            ? JSON.stringify(data.data.pagination.lastEvaluatedKey)
            : null;

        // Replace current pods with initial results
        dispatch(
          initializePods({
            pods: pods,
            lastKey: newLastKey,
            hasMore: effectiveHasMore,
          }),
        );
      } else {
        throw new Error(data.message || "Failed to load pods");
      }
    } catch (error) {
      addToast({
        color: "danger",
        title: "Error loading pods",
        description: error.message || "Please try again",
      });
    } finally {
      setIsServerSearching(false);
      dispatch(setLoading(false));
    }
  };

  /**
   * Applies status and admin filters client-side
   * Name filtering is handled on the server
   */
  const filteredPods = useMemo(() => {
    // If no client-side filters are applied, just return all pods
    if (!statusFilter && !adminFilter) {
      return pods;
    }

    return pods.filter((pod) => {
      // Status filter (exact match)
      const statusMatch =
        !statusFilter || (pod.status && pod.status === statusFilter);

      // Admin filter (array includes)
      const adminMatch =
        !adminFilter ||
        (pod.admin_usernames &&
          Array.isArray(pod.admin_usernames) &&
          pod.admin_usernames.includes(adminFilter));

      // Both filters must match (name filtering is done on server)
      return statusMatch && adminMatch;
    });
  }, [pods, statusFilter, adminFilter]);

  // Determines if we're in a loading state from either regular loading or server search
  const isComponentLoading = isLoading || isServerSearching;

  return (
    <div className="flex flex-1 flex-col space-y-3 overflow-hidden">
      <PodFilterHeader
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
        hasActiveFilters={hasActiveFilters}
        activeFiltersCount={activeFiltersCount}
      />

      <PodFilterPanel
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        adminFilter={adminFilter}
        setAdminFilter={setAdminFilter}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <Suspense>
        <div className="hide-scroll flex flex-1 flex-col overflow-y-auto">
          <PodGrid
            pods={filteredPods}
            hasMore={hasMore}
            isLoading={isComponentLoading}
            loadMorePods={fetchMorePods}
            hasActiveFilters={hasActiveFilters}
            resetFilters={resetFilters}
          />
        </div>
      </Suspense>
    </div>
  );
};

export default LoadMorePods;
