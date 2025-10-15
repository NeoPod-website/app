"use client";

import { Button } from "@heroui/react";
import { useSelector } from "react-redux";
import { UserIcon, FileTextIcon, Filter } from "lucide-react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";

import SubmissionFilterModal from "@/components/ui/modals/SubmissionFilterModal";

const API_ENDPOINTS = {
  QUESTS: (podId) =>
    `${process.env.NEXT_PUBLIC_API_URL}/quests/filter/${podId}`,
  CATEGORIES: (podId) =>
    `${process.env.NEXT_PUBLIC_API_URL}/categories/filter/${podId}`,
  AMBASSADORS: (podId) =>
    `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/pod/${podId}/search`,
};

const FILTER_CONFIG = {
  FETCH_LIMIT: 50,
  AMBASSADOR_MIN_SEARCH_LENGTH: 3,
  DEBOUNCE_DELAY: 500,
};

const STATUS_LABELS = {
  all: "All",
  pending: "Pending",
  flagged: "Flagged",
  approved: "Approved",
  rejected: "Rejected",
  highlighted: "Highlighted",
};

const DEFAULT_FILTERS = {
  primaryFilterKey: null,
  primaryFilterValue: null,
  status: "all",
  order: "desc",
};

const fetchWithErrorHandling = async (url, errorMessage) => {
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`${errorMessage}: ${response.statusText}`);
  }

  return response.json();
};

const useFetchFilterData = (currentPodId, filterType) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(
    async (searchTerm = "") => {
      if (!currentPodId) {
        setData([]);
        setError(null);
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        let url, result, transformedData;

        switch (filterType) {
          case "quests": {
            const params = new URLSearchParams({
              limit: String(FILTER_CONFIG.FETCH_LIMIT),
            });
            if (searchTerm?.trim()) params.append("search", searchTerm.trim());

            url = `${API_ENDPOINTS.QUESTS(currentPodId)}?${params}`;
            result = await fetchWithErrorHandling(
              url,
              "Failed to fetch quests",
            );
            transformedData = result.data.quests || [];
            break;
          }

          case "categories": {
            const params = new URLSearchParams({
              limit: String(FILTER_CONFIG.FETCH_LIMIT),
            });
            if (searchTerm?.trim()) params.append("search", searchTerm.trim());

            url = `${API_ENDPOINTS.CATEGORIES(currentPodId)}?${params}`;
            result = await fetchWithErrorHandling(
              url,
              "Failed to fetch categories",
            );
            transformedData = result.data.categories || [];
            break;
          }

          case "ambassadors": {
            if (
              !searchTerm ||
              searchTerm.trim().length <
                FILTER_CONFIG.AMBASSADOR_MIN_SEARCH_LENGTH
            ) {
              setData([]);
              setLoading(false);
              return;
            }

            const params = new URLSearchParams({ q: searchTerm.trim() });
            url = `${API_ENDPOINTS.AMBASSADORS(currentPodId)}?${params}`;
            result = await fetchWithErrorHandling(
              url,
              "Failed to search ambassadors",
            );
            transformedData = (result.data || []).map((ambassador) => ({
              id: ambassador.ambassador_id || ambassador.id,
              name: ambassador.username || ambassador.name,
            }));
            break;
          }

          default:
            transformedData = [];
        }

        setData(transformedData);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(`Error fetching ${filterType}:`, err);
          setError(err.message || `Failed to load ${filterType}`);
          setData([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [currentPodId, filterType],
  );

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { data, loading, error, fetchData };
};

const SubmissionsListHeader = ({
  loadedCount,
  currentStatus,
  onFiltersChange,
}) => {
  const allPods = useSelector((state) => state.pods.pods);
  const currentPodId = useSelector((state) => state.pods.currentPod);

  const currentPod = useMemo(
    () => allPods?.find((pod) => pod.pod_id === currentPodId),
    [allPods, currentPodId],
  );

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState(DEFAULT_FILTERS);

  // Fetch hooks for each filter type
  const quests = useFetchFilterData(currentPodId, "quests");
  const categories = useFetchFilterData(currentPodId, "categories");
  const ambassadors = useFetchFilterData(currentPodId, "ambassadors");

  // Derive reviewers from current pod
  const reviewers = useMemo(() => {
    if (!currentPod?.admin_usernames?.length) return [];
    return currentPod.admin_usernames.map((username) => ({
      id: username,
      name: username,
    }));
  }, [currentPod]);

  // Initial data fetch on pod change
  useEffect(() => {
    if (currentPodId) {
      quests.fetchData();
      categories.fetchData();
    }
  }, [currentPodId]);

  // Search callbacks with debouncing
  const searchQuests = useCallback(
    (searchTerm) => {
      const timer = setTimeout(() => {
        quests.fetchData(searchTerm);
      }, FILTER_CONFIG.DEBOUNCE_DELAY);
      return () => clearTimeout(timer);
    },
    [quests.fetchData],
  );

  const searchCategories = useCallback(
    (searchTerm) => {
      const timer = setTimeout(() => {
        categories.fetchData(searchTerm);
      }, FILTER_CONFIG.DEBOUNCE_DELAY);
      return () => clearTimeout(timer);
    },
    [categories.fetchData],
  );

  const searchAmbassadors = useCallback(
    (searchTerm) => {
      const timer = setTimeout(() => {
        ambassadors.fetchData(searchTerm);
      }, FILTER_CONFIG.DEBOUNCE_DELAY);
      return () => clearTimeout(timer);
    },
    [ambassadors.fetchData],
  );

  const handleApplyFilters = useCallback(
    (filters) => {
      setCurrentFilters(filters);
      onFiltersChange(filters);
    },
    [onFiltersChange],
  );

  const handleClearFilters = useCallback(
    (filters) => {
      setCurrentFilters(filters);
      onFiltersChange(filters);
    },
    [onFiltersChange],
  );

  const hasActiveFilters = useMemo(
    () =>
      currentFilters.primaryFilterKey !== null ||
      currentFilters.status !== "all" ||
      currentFilters.order !== "desc",
    [currentFilters],
  );

  const getStatusLabel = useCallback(
    (status) => STATUS_LABELS[status] || "Submissions",
    [],
  );

  const podDisplayName =
    currentPod?.name || currentPod?.pod_name || "Current Pod";

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">
            {getStatusLabel(currentStatus)} Submissions
          </h1>

          <div className="flex items-center gap-4 text-sm text-foreground-500">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span>{podDisplayName}</span>
            </div>

            {loadedCount > 0 && (
              <div className="flex items-center gap-2">
                <FileTextIcon className="h-4 w-4" />
                <span>{loadedCount} loaded</span>
              </div>
            )}
          </div>
        </div>

        <Button
          color={hasActiveFilters ? "primary" : "default"}
          variant="bordered"
          startContent={<Filter size={16} />}
          onPress={() => setIsFilterModalOpen(true)}
          className={`min-w-6 gap-0 !px-3 !py-1.5 text-sm font-medium ${
            hasActiveFilters
              ? "bg-blue-600 hover:bg-blue-700"
              : "border-gray-700"
          }`}
        />
      </div>

      <SubmissionFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentFilters={currentFilters}
        applyFilters={handleApplyFilters}
        clearFilters={handleClearFilters}
        categories={categories.data}
        quests={quests.data}
        reviewers={reviewers}
        ambassadors={ambassadors.data}
        loading={{
          categories: categories.loading,
          quests: quests.loading,
          ambassadors: ambassadors.loading,
        }}
        errors={{
          categories: categories.error,
          quests: quests.error,
          ambassadors: ambassadors.error,
        }}
        onQuestSearch={searchQuests}
        onCategorySearch={searchCategories}
        onAmbassadorSearch={searchAmbassadors}
      />
    </>
  );
};

export default SubmissionsListHeader;
