"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useCallback, useRef } from "react";

import MainPageScroll from "@/components/common/MainPageScroll";
import WrapperContainer from "@/components/common/WrapperContainer";

import { NoPodSelected } from "@/components/ui/loader/submission/admin/EmptySubmissionStates";

import SubmissionsList from "@/components/layout/submissions/admin/SubmissionsList";
import NoSubmissionSelected from "@/components/layout/submissions/admin/NoSubmissionSelected";
import ReviewDetailsPanel from "@/components/layout/submissions/admin/details/ReviewDetailsPanel";

import { setHighlightedSubmissionsData } from "@/redux/slice/questSlice";

// Helper for dynamic Storage Keys
const getStorageKey = (podId) => `neo_admin_filters_pod_${podId}`;

const buildApiUrl = (podId, filters) => {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/submissions/pod/${podId}`;

  if (filters.primaryFilterKey && filters.primaryFilterValue) {
    switch (filters.primaryFilterKey) {
      case "quest_id":
        return `${baseUrl}/quest/${filters.primaryFilterValue}`;
      case "category_id":
        return `${baseUrl}/category/${filters.primaryFilterValue}`;
      case "reviewer_id":
        return `${baseUrl}/reviewed-by/${filters.primaryFilterValue}`;
      case "ambassador_id":
        return `${baseUrl}/ambassador/${filters.primaryFilterValue}`;
      default:
        break;
    }
  }

  const { status } = filters;
  switch (status) {
    case "all":
      return baseUrl;
    case "flagged":
      return `${baseUrl}/flagged`;
    case "pending":
    case "approved":
    case "rejected":
    case "highlighted":
      return `${baseUrl}/${status}`;
    default:
      return `${baseUrl}/pending`; // Default fallback
  }
};

const apiRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
    ...options,
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

const AdminReviewPage = () => {
  const dispatch = useDispatch();
  const podId = useSelector((state) => state.pods.currentPod);

  // --- STATE ---
  const [hasMore, setHasMore] = useState(true);
  const [nextKey, setNextKey] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [currentStatus, setCurrentStatus] = useState("pending");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [listLoading, setListLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadedSubmissions, setLoadedSubmissions] = useState(new Set());
  const [shouldPreload, setShouldPreload] = useState(false);
  const [activeFilters, setActiveFilters] = useState(null); // Null initially to detect loading from storage

  const isAutoLoadingRef = useRef(false);

  /**
   * Fetch submissions from API
   */
  const fetchSubmissions = useCallback(
    async (filters, lastEvaluatedKey = null, isLoadMore = false) => {
      if (!podId || !filters) return;

      try {
        if (!isLoadMore) {
          setHasMore(true);
          setNextKey(null);
          setSubmissions([]);
          setListLoading(true);
          setSelectedSubmission(null);
          setLoadedSubmissions(new Set());
        } else {
          setLoadingMore(true);
        }

        const apiUrl = buildApiUrl(podId, filters);
        const params = new URLSearchParams({
          limit: "10",
          order: filters.order || "desc",
        });

        if (filters.primaryFilterKey && filters.status !== "all") {
          params.append("review_status", filters.status);
        }

        if (
          filters.primaryFilterKey === "ambassador_id" &&
          filters.status !== "all"
        ) {
          params.append("status", filters.status);
        }

        if (lastEvaluatedKey) params.append("last_key", lastEvaluatedKey);

        const { data } = await apiRequest(`${apiUrl}?${params}`);
        const newNextKey = data.next_key || null;
        const rawSubmissions = data.submissions || [];

        if (isLoadMore) {
          setSubmissions((prev) => [...prev, ...rawSubmissions]);
        } else {
          setSubmissions(rawSubmissions);
        }

        setNextKey(newNextKey);
        setHasMore(newNextKey !== null);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      } finally {
        setListLoading(false);
        setLoadingMore(false);
        isAutoLoadingRef.current = false;
      }
    },
    [podId],
  );

  /**
   * Initialization & Pod Persistence logic
   */
  useEffect(() => {
    if (!podId) return;

    // 1. Try to get Pod-Specific saved filters
    const savedFilters = localStorage.getItem(getStorageKey(podId));
    let initialFilters;

    if (savedFilters) {
      try {
        initialFilters = JSON.parse(savedFilters);
      } catch (e) {
        console.error("Failed to parse saved filters", e);
      }
    }

    // 2. Fallback to Default (Fix: Defaulting to 'pending')
    if (!initialFilters) {
      initialFilters = {
        primaryFilterKey: null,
        primaryFilterValue: null,
        status: "pending",
        order: "desc",
      };
    }

    // 3. Set State
    dispatch(setHighlightedSubmissionsData([]));
    setActiveFilters(initialFilters);
    setCurrentStatus(initialFilters.status);

    // 4. Initial Fetch
    fetchSubmissions(initialFilters, null, false);
  }, [podId, dispatch, fetchSubmissions]);

  /**
   * Persistence: Update storage when filters change
   */
  useEffect(() => {
    if (podId && activeFilters) {
      localStorage.setItem(getStorageKey(podId), JSON.stringify(activeFilters));
    }
  }, [activeFilters, podId]);

  // --- HANDLERS ---

  const handleFiltersChange = useCallback(
    (newFilters) => {
      setActiveFilters(newFilters);
      setCurrentStatus(newFilters.status);
      dispatch(setHighlightedSubmissionsData([]));
      fetchSubmissions(newFilters, null, false);
    },
    [fetchSubmissions, dispatch],
  );

  const handleStatusChange = useCallback(
    (status) => {
      const newFilters = {
        ...activeFilters,
        status,
        primaryFilterKey: null,
        primaryFilterValue: null,
      };
      handleFiltersChange(newFilters);
    },
    [activeFilters, handleFiltersChange],
  );

  const handleLoadMore = useCallback(() => {
    if (!hasMore || loadingMore || isAutoLoadingRef.current) return;
    fetchSubmissions(activeFilters, nextKey, true);
  }, [activeFilters, nextKey, hasMore, loadingMore, fetchSubmissions]);

  const autoLoadMore = useCallback(() => {
    if (!hasMore || loadingMore || isAutoLoadingRef.current) return;
    isAutoLoadingRef.current = true;
    fetchSubmissions(activeFilters, nextKey, true);
  }, [activeFilters, nextKey, hasMore, loadingMore, fetchSubmissions]);

  const handleSubmissionDataLoaded = useCallback((submissionId) => {
    setLoadedSubmissions((prev) => new Set(prev).add(submissionId));
  }, []);

  const getNextSubmission = useCallback(
    (currentSubmissionId) => {
      const currentIndex = submissions.findIndex(
        (sub) => sub.submission_id === currentSubmissionId,
      );
      if (currentIndex === -1) return null;

      for (let i = currentIndex + 1; i < submissions.length; i++) {
        if (loadedSubmissions.has(submissions[i].submission_id))
          return submissions[i];
      }

      if (currentIndex < submissions.length - 1)
        return submissions[currentIndex + 1];
      if (currentIndex >= submissions.length - 2 && hasMore)
        setShouldPreload(true);

      return null;
    },
    [submissions, loadedSubmissions, hasMore],
  );

  const handleSubmissionUpdate = useCallback(
    (updatedSubmission) => {
      const currentSubmission = submissions.find(
        (sub) => sub.submission_id === updatedSubmission.submission_id,
      );
      const wasJustReviewed =
        currentSubmission?.review_status === "pending" &&
        updatedSubmission.review_status !== "pending";

      if (wasJustReviewed) {
        const nextSubmission = getNextSubmission(
          updatedSubmission.submission_id,
        );

        setSubmissions((prev) =>
          prev.filter(
            (sub) => sub.submission_id !== updatedSubmission.submission_id,
          ),
        );
        setLoadedSubmissions((prev) => {
          const newSet = new Set(prev);
          newSet.delete(updatedSubmission.submission_id);
          return newSet;
        });

        if (nextSubmission) {
          setIsTransitioning(true);
          setTimeout(() => {
            setSelectedSubmission(nextSubmission);
            setReviewComment("");
            setIsTransitioning(false);
            const nextIndex = submissions.findIndex(
              (sub) => sub.submission_id === nextSubmission.submission_id,
            );
            if (nextIndex >= submissions.length - 3 && hasMore && !loadingMore)
              autoLoadMore();
          }, 300);
        } else {
          setSelectedSubmission(null);
          setReviewComment("");
          setIsTransitioning(false);
          if (hasMore && !loadingMore) autoLoadMore();
        }
      } else {
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.submission_id === updatedSubmission.submission_id
              ? updatedSubmission
              : sub,
          ),
        );
        if (
          selectedSubmission?.submission_id === updatedSubmission.submission_id
        ) {
          setSelectedSubmission(updatedSubmission);
        }
      }
    },
    [
      submissions,
      selectedSubmission,
      hasMore,
      loadingMore,
      getNextSubmission,
      autoLoadMore,
    ],
  );

  // Shortcut logic
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (
        !selectedSubmission ||
        ["INPUT", "TEXTAREA"].includes(e.target.tagName)
      )
        return;
      const currentIndex = submissions.findIndex(
        (s) => s.submission_id === selectedSubmission.submission_id,
      );

      if ((e.ctrlKey || e.metaKey) && e.key === "ArrowRight") {
        e.preventDefault();
        if (currentIndex < submissions.length - 1) {
          const next = submissions[currentIndex + 1];
          setSelectedSubmission(next);
          if (currentIndex >= submissions.length - 3 && hasMore) autoLoadMore();
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentIndex > 0)
          setSelectedSubmission(submissions[currentIndex - 1]);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedSubmission, submissions, hasMore, autoLoadMore]);

  if (!podId) {
    return (
      <MainPageScroll scrollable={false}>
        <NoPodSelected />
      </MainPageScroll>
    );
  }

  return (
    <MainPageScroll scrollable={false}>
      <div className="flex h-full flex-1 gap-4">
        <WrapperContainer scrollable={true} className="flex-1">
          <SubmissionsList
            hasMore={hasMore}
            loading={listLoading}
            loadingMore={loadingMore}
            submissions={submissions}
            onLoadMore={handleLoadMore}
            currentStatus={currentStatus}
            setSubmissions={setSubmissions}
            onStatusChange={handleStatusChange}
            selectedSubmission={selectedSubmission}
            setSelectedSubmission={setSelectedSubmission}
            activeFilters={activeFilters}
            onFiltersChange={handleFiltersChange}
            onSubmissionDataLoaded={handleSubmissionDataLoaded}
            onAutoLoadMore={autoLoadMore}
          />
        </WrapperContainer>

        {selectedSubmission ? (
          <ReviewDetailsPanel
            submission={selectedSubmission}
            reviewComment={reviewComment}
            setReviewComment={setReviewComment}
            onSubmissionUpdate={handleSubmissionUpdate}
            isTransitioning={isTransitioning}
          />
        ) : (
          <NoSubmissionSelected
            currentStatus={currentStatus}
            submissionCount={submissions.length}
          />
        )}
      </div>
    </MainPageScroll>
  );
};

export default AdminReviewPage;
