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

  // Status-based filtering (legacy support)
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
      return `${baseUrl}/pending`;
  }
};

const apiRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const AdminReviewPage = () => {
  const dispatch = useDispatch();
  const podId = useSelector((state) => state.pods.currentPod);

  const [hasMore, setHasMore] = useState(true);
  const [nextKey, setNextKey] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [currentStatus, setCurrentStatus] = useState("pending");
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const [listLoading, setListLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Track loaded submissions (with ambassador & quest data)
  const [loadedSubmissions, setLoadedSubmissions] = useState(new Set());

  // Track if we're near the end and should preload
  const [shouldPreload, setShouldPreload] = useState(false);

  // Active filters state
  const [activeFilters, setActiveFilters] = useState({
    primaryFilterKey: null,
    primaryFilterValue: null,
    status: "all",
    order: "desc",
  });

  // Ref to track if we're currently auto-loading
  const isAutoLoadingRef = useRef(false);

  /**
   * Fetch submissions from API
   */
  const fetchSubmissions = useCallback(
    async (filters, lastEvaluatedKey = null, isLoadMore = false) => {
      if (!podId) return;

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

        // Add review_status for endpoints that support it
        if (filters.primaryFilterKey && filters.status !== "all") {
          params.append("review_status", filters.status);
        }

        // Add status for ambassador endpoint
        if (
          filters.primaryFilterKey === "ambassador_id" &&
          filters.status !== "all"
        ) {
          params.append("status", filters.status);
        }

        if (lastEvaluatedKey) {
          params.append("last_key", lastEvaluatedKey);
        }

        const { data } = await apiRequest(`${apiUrl}?${params}`);
        const newNextKey = data.next_key || null;
        const rawSubmissions = data.submissions || [];
        const newHasMore = newNextKey !== null;

        if (isLoadMore) {
          setSubmissions((prev) => [...prev, ...rawSubmissions]);
        } else {
          setSubmissions(rawSubmissions);
        }

        setNextKey(newNextKey);
        setHasMore(newHasMore);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
        if (!isLoadMore) {
          setSubmissions([]);
          setSelectedSubmission(null);
        }
      } finally {
        setListLoading(false);
        setLoadingMore(false);
        isAutoLoadingRef.current = false;
      }
    },
    [podId],
  );

  /**
   * Handle filter changes from modal
   */
  const handleFiltersChange = useCallback(
    (newFilters) => {
      setActiveFilters(newFilters);
      setCurrentStatus(newFilters.status);
      setSelectedSubmission(null);
      setReviewComment("");
      setLoadedSubmissions(new Set());

      // ✅ CRITICAL FIX: Clear highlighted submissions when changing filters
      // This prevents showing highlights from a different quest
      dispatch(setHighlightedSubmissionsData([]));

      fetchSubmissions(newFilters, null, false);
    },
    [fetchSubmissions, dispatch],
  );

  /**
   * Handle status chip changes (legacy support)
   */
  const handleStatusChange = useCallback(
    (status) => {
      const newFilters = {
        ...activeFilters,
        status,
        primaryFilterKey: null,
        primaryFilterValue: null,
      };
      setCurrentStatus(status);
      setActiveFilters(newFilters);
      setSelectedSubmission(null);
      setReviewComment("");
      setLoadedSubmissions(new Set());

      // ✅ CRITICAL FIX: Clear highlighted submissions when changing status
      dispatch(setHighlightedSubmissionsData([]));

      fetchSubmissions(newFilters, null, false);
    },
    [activeFilters, fetchSubmissions, dispatch],
  );

  /**
   * Manual load more (triggered by button click)
   */
  const handleLoadMore = useCallback(() => {
    if (!hasMore || loadingMore || isAutoLoadingRef.current) return;
    fetchSubmissions(activeFilters, nextKey, true);
  }, [activeFilters, nextKey, hasMore, loadingMore, fetchSubmissions]);

  /**
   * Auto load more (triggered when near bottom or need next submission)
   */
  const autoLoadMore = useCallback(() => {
    if (!hasMore || loadingMore || isAutoLoadingRef.current) return;

    isAutoLoadingRef.current = true;
    fetchSubmissions(activeFilters, nextKey, true);
  }, [activeFilters, nextKey, hasMore, loadingMore, fetchSubmissions]);

  /**
   * Track when submission data is fully loaded
   */
  const handleSubmissionDataLoaded = useCallback((submissionId) => {
    setLoadedSubmissions((prev) => {
      const newSet = new Set(prev);
      newSet.add(submissionId);
      return newSet;
    });
  }, []);

  /**
   * Get next submission that has data loaded (or next available)
   */
  const getNextSubmission = useCallback(
    (currentSubmissionId) => {
      const currentIndex = submissions.findIndex(
        (sub) => sub.submission_id === currentSubmissionId,
      );

      if (currentIndex === -1) return null;

      // First, try to find the next loaded submission
      for (let i = currentIndex + 1; i < submissions.length; i++) {
        if (loadedSubmissions.has(submissions[i].submission_id)) {
          return submissions[i];
        }
      }

      // If no loaded submission found, return the immediate next one
      // (it will load its data automatically)
      if (currentIndex < submissions.length - 1) {
        return submissions[currentIndex + 1];
      }

      // Check if we need to load more submissions
      if (currentIndex >= submissions.length - 2 && hasMore) {
        setShouldPreload(true);
      }

      return null;
    },
    [submissions, loadedSubmissions, hasMore],
  );

  /**
   * Handle submission update after review
   * - Remove reviewed submission from list (if status changed from pending)
   * - Auto-select next submission
   */
  const handleSubmissionUpdate = useCallback(
    (updatedSubmission) => {
      const currentSubmission = submissions.find(
        (sub) => sub.submission_id === updatedSubmission.submission_id,
      );

      const wasJustReviewed =
        currentSubmission?.review_status === "pending" &&
        updatedSubmission.review_status !== "pending";

      if (wasJustReviewed) {
        // Get next submission BEFORE removing current one
        const nextSubmission = getNextSubmission(
          updatedSubmission.submission_id,
        );

        // Remove the reviewed submission from the list
        setSubmissions((prev) =>
          prev.filter(
            (sub) => sub.submission_id !== updatedSubmission.submission_id,
          ),
        );

        // Remove from loaded set
        setLoadedSubmissions((prev) => {
          const newSet = new Set(prev);
          newSet.delete(updatedSubmission.submission_id);
          return newSet;
        });

        // Transition to next submission
        if (nextSubmission) {
          setIsTransitioning(true);

          // Small delay for smooth transition
          setTimeout(() => {
            setSelectedSubmission(nextSubmission);
            setReviewComment(""); // Clear comment for next review
            setIsTransitioning(false);

            // Check if we need to load more submissions
            const nextIndex = submissions.findIndex(
              (sub) => sub.submission_id === nextSubmission.submission_id,
            );

            // If we're within 3 submissions of the end, auto-load more
            if (
              nextIndex >= submissions.length - 3 &&
              hasMore &&
              !loadingMore
            ) {
              autoLoadMore();
            }
          }, 300);
        } else {
          // No more submissions in current list
          setSelectedSubmission(null);
          setReviewComment("");
          setIsTransitioning(false);

          // Try to load more if available
          if (hasMore && !loadingMore) {
            autoLoadMore();
          }
        }
      } else {
        // Just update the submission (for non-review updates like flagging)
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

  /**
   * Preload next batch when getting close to the end
   */
  useEffect(() => {
    if (shouldPreload && hasMore && !loadingMore && !isAutoLoadingRef.current) {
      setShouldPreload(false);
      autoLoadMore();
    }
  }, [shouldPreload, hasMore, loadingMore, autoLoadMore]);

  /**
   * Keyboard shortcuts for navigation
   */
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only work if a submission is selected and not in an input field
      if (
        !selectedSubmission ||
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA"
      ) {
        return;
      }

      const currentIndex = submissions.findIndex(
        (s) => s.submission_id === selectedSubmission.submission_id,
      );

      // Ctrl/Cmd + Right Arrow: Jump to next
      if ((e.ctrlKey || e.metaKey) && e.key === "ArrowRight") {
        e.preventDefault();
        if (currentIndex < submissions.length - 1) {
          const next = submissions[currentIndex + 1];
          setSelectedSubmission(next);

          // Auto-load if near end
          if (currentIndex >= submissions.length - 3 && hasMore) {
            autoLoadMore();
          }
        }
      }

      // Ctrl/Cmd + Left Arrow: Jump to previous
      if ((e.ctrlKey || e.metaKey) && e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentIndex > 0) {
          setSelectedSubmission(submissions[currentIndex - 1]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedSubmission, submissions, hasMore, autoLoadMore]);

  /**
   * Initialize on pod change
   */
  useEffect(() => {
    if (podId) {
      dispatch(setHighlightedSubmissionsData([]));

      // Reset filters when pod changes
      const defaultFilters = {
        primaryFilterKey: null,
        primaryFilterValue: null,
        status: "pending",
        order: "desc",
      };
      setActiveFilters(defaultFilters);
      setCurrentStatus("pending");
      setLoadedSubmissions(new Set());
      fetchSubmissions(defaultFilters, null, false);
    }
  }, [podId, dispatch, fetchSubmissions]);

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
