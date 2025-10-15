"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useCallback } from "react";

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
  const [reviewLoading, setReviewLoading] = useState(false);

  // NEW: Active filters state
  const [activeFilters, setActiveFilters] = useState({
    primaryFilterKey: null,
    primaryFilterValue: null,
    status: "all",
    order: "desc",
  });

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
      }
    },
    [podId],
  );

  // NEW: Handle filter changes from modal
  const handleFiltersChange = useCallback(
    (newFilters) => {
      setActiveFilters(newFilters);
      setCurrentStatus(newFilters.status);
      setSelectedSubmission(null);
      setReviewComment("");
      fetchSubmissions(newFilters, null, false);
    },
    [fetchSubmissions],
  );

  // Handle status chip changes (legacy support)
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
      fetchSubmissions(newFilters, null, false);
    },
    [activeFilters, fetchSubmissions],
  );

  const handleLoadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    fetchSubmissions(activeFilters, nextKey, true);
  }, [activeFilters, nextKey, hasMore, loadingMore, fetchSubmissions]);

  const handleReview = useCallback(
    async (submissionId, action, comment) => {
      try {
        setReviewLoading(true);

        const response = await apiRequest(
          `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}/review`,
          {
            method: "PATCH",
            body: JSON.stringify({
              action,
              comment,
            }),
          },
        );

        const updatedSubmission = response.data || response;

        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.submission_id === submissionId ? updatedSubmission : sub,
          ),
        );

        if (selectedSubmission?.submission_id === submissionId) {
          setSelectedSubmission(updatedSubmission);
        }

        setReviewComment("");
      } catch (error) {
        console.error("Failed to review submission:", error);
        alert(`Failed to ${action} submission. Please try again.`);
      } finally {
        setReviewLoading(false);
      }
    },
    [selectedSubmission?.submission_id],
  );

  const handleSubmissionUpdate = useCallback(
    (updatedSubmission) => {
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
    },
    [selectedSubmission?.submission_id],
  );

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
          />
        </WrapperContainer>

        {selectedSubmission ? (
          <ReviewDetailsPanel
            onReview={handleReview}
            reviewComment={reviewComment}
            submission={selectedSubmission}
            setReviewComment={setReviewComment}
            onSubmissionUpdate={handleSubmissionUpdate}
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
