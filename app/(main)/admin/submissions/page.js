// "use client";

// import { useSelector, useDispatch } from "react-redux";
// import { useState, useEffect, useCallback } from "react";

// import MainPageScroll from "@/components/common/MainPageScroll";
// import WrapperContainer from "@/components/common/WrapperContainer";

// import { NoPodSelected } from "@/components/ui/loader/submission/admin/EmptySubmissionStates";

// import SubmissionsList from "@/components/layout/submissions/admin/SubmissionsList";
// import NoSubmissionSelected from "@/components/layout/submissions/admin/NoSubmissionSelected";
// import ReviewDetailsPanel from "@/components/layout/submissions/admin/details/ReviewDetailsPanel";

// import { setHighlightedSubmissionsData } from "@/redux/slice/questSlice";

// const buildApiUrl = (podId, filters) => {
//   const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/submissions/pod/${podId}`;

//   if (filters.primaryFilterKey && filters.primaryFilterValue) {
//     switch (filters.primaryFilterKey) {
//       case "quest_id":
//         return `${baseUrl}/quest/${filters.primaryFilterValue}`;
//       case "category_id":
//         return `${baseUrl}/category/${filters.primaryFilterValue}`;
//       case "reviewer_id":
//         return `${baseUrl}/reviewed-by/${filters.primaryFilterValue}`;
//       case "ambassador_id":
//         return `${baseUrl}/ambassador/${filters.primaryFilterValue}`;
//       default:
//         break;
//     }
//   }

//   // Status-based filtering (legacy support)
//   const { status } = filters;
//   switch (status) {
//     case "all":
//       return baseUrl;
//     case "flagged":
//       return `${baseUrl}/flagged`;
//     case "pending":
//     case "approved":
//     case "rejected":
//     case "highlighted":
//       return `${baseUrl}/${status}`;
//     default:
//       return `${baseUrl}/pending`;
//   }
// };

// const apiRequest = async (url, options = {}) => {
//   const response = await fetch(url, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include",
//     cache: "no-store",
//     ...options,
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }

//   return response.json();
// };

// const AdminReviewPage = () => {
//   const dispatch = useDispatch();
//   const podId = useSelector((state) => state.pods.currentPod);

//   const [hasMore, setHasMore] = useState(true);
//   const [nextKey, setNextKey] = useState(null);
//   const [submissions, setSubmissions] = useState([]);
//   const [currentStatus, setCurrentStatus] = useState("pending");
//   const [selectedSubmission, setSelectedSubmission] = useState(null);

//   const [listLoading, setListLoading] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [reviewComment, setReviewComment] = useState("");
//   const [reviewLoading, setReviewLoading] = useState(false);

//   // NEW: Active filters state
//   const [activeFilters, setActiveFilters] = useState({
//     primaryFilterKey: null,
//     primaryFilterValue: null,
//     status: "all",
//     order: "desc",
//   });

//   const fetchSubmissions = useCallback(
//     async (filters, lastEvaluatedKey = null, isLoadMore = false) => {
//       if (!podId) return;

//       try {
//         if (!isLoadMore) {
//           setHasMore(true);
//           setNextKey(null);
//           setSubmissions([]);
//           setListLoading(true);
//           setSelectedSubmission(null);
//         } else {
//           setLoadingMore(true);
//         }

//         const apiUrl = buildApiUrl(podId, filters);
//         const params = new URLSearchParams({
//           limit: "10",
//           order: filters.order || "desc",
//         });

//         // Add review_status for endpoints that support it
//         if (filters.primaryFilterKey && filters.status !== "all") {
//           params.append("review_status", filters.status);
//         }

//         // Add status for ambassador endpoint
//         if (
//           filters.primaryFilterKey === "ambassador_id" &&
//           filters.status !== "all"
//         ) {
//           params.append("status", filters.status);
//         }

//         if (lastEvaluatedKey) {
//           params.append("last_key", lastEvaluatedKey);
//         }

//         const { data } = await apiRequest(`${apiUrl}?${params}`);
//         const newNextKey = data.next_key || null;
//         const rawSubmissions = data.submissions || [];
//         const newHasMore = newNextKey !== null;

//         if (isLoadMore) {
//           setSubmissions((prev) => [...prev, ...rawSubmissions]);
//         } else {
//           setSubmissions(rawSubmissions);
//         }

//         setNextKey(newNextKey);
//         setHasMore(newHasMore);
//       } catch (error) {
//         console.error("Failed to fetch submissions:", error);
//         if (!isLoadMore) {
//           setSubmissions([]);
//           setSelectedSubmission(null);
//         }
//       } finally {
//         setListLoading(false);
//         setLoadingMore(false);
//       }
//     },
//     [podId],
//   );

//   // NEW: Handle filter changes from modal
//   const handleFiltersChange = useCallback(
//     (newFilters) => {
//       setActiveFilters(newFilters);
//       setCurrentStatus(newFilters.status);
//       setSelectedSubmission(null);
//       setReviewComment("");
//       fetchSubmissions(newFilters, null, false);
//     },
//     [fetchSubmissions],
//   );

//   // Handle status chip changes (legacy support)
//   const handleStatusChange = useCallback(
//     (status) => {
//       const newFilters = {
//         ...activeFilters,
//         status,
//         primaryFilterKey: null,
//         primaryFilterValue: null,
//       };
//       setCurrentStatus(status);
//       setActiveFilters(newFilters);
//       setSelectedSubmission(null);
//       setReviewComment("");
//       fetchSubmissions(newFilters, null, false);
//     },
//     [activeFilters, fetchSubmissions],
//   );

//   const handleLoadMore = useCallback(() => {
//     if (!hasMore || loadingMore) return;
//     fetchSubmissions(activeFilters, nextKey, true);
//   }, [activeFilters, nextKey, hasMore, loadingMore, fetchSubmissions]);

//   const handleReview = useCallback(
//     async (submissionId, action, comment) => {
//       try {
//         setReviewLoading(true);

//         const response = await apiRequest(
//           `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}/review`,
//           {
//             method: "PATCH",
//             body: JSON.stringify({
//               action,
//               comment,
//             }),
//           },
//         );

//         const updatedSubmission = response.data || response;

//         setSubmissions((prev) =>
//           prev.map((sub) =>
//             sub.submission_id === submissionId ? updatedSubmission : sub,
//           ),
//         );

//         if (selectedSubmission?.submission_id === submissionId) {
//           setSelectedSubmission(updatedSubmission);
//         }

//         setReviewComment("");
//       } catch (error) {
//         console.error("Failed to review submission:", error);
//         alert(`Failed to ${action} submission. Please try again.`);
//       } finally {
//         setReviewLoading(false);
//       }
//     },
//     [selectedSubmission?.submission_id],
//   );

//   const handleSubmissionUpdate = useCallback(
//     (updatedSubmission) => {
//       setSubmissions((prev) =>
//         prev.map((sub) =>
//           sub.submission_id === updatedSubmission.submission_id
//             ? updatedSubmission
//             : sub,
//         ),
//       );

//       if (
//         selectedSubmission?.submission_id === updatedSubmission.submission_id
//       ) {
//         setSelectedSubmission(updatedSubmission);
//       }
//     },
//     [selectedSubmission?.submission_id],
//   );

//   useEffect(() => {
//     if (podId) {
//       dispatch(setHighlightedSubmissionsData([]));

//       // Reset filters when pod changes
//       const defaultFilters = {
//         primaryFilterKey: null,
//         primaryFilterValue: null,
//         status: "pending",
//         order: "desc",
//       };
//       setActiveFilters(defaultFilters);
//       setCurrentStatus("pending");
//       fetchSubmissions(defaultFilters, null, false);
//     }
//   }, [podId, dispatch, fetchSubmissions]);

//   if (!podId) {
//     return (
//       <MainPageScroll scrollable={false}>
//         <NoPodSelected />
//       </MainPageScroll>
//     );
//   }

//   return (
//     <MainPageScroll scrollable={false}>
//       <div className="flex h-full flex-1 gap-4">
//         <WrapperContainer scrollable={true} className="flex-1">
//           <SubmissionsList
//             hasMore={hasMore}
//             loading={listLoading}
//             loadingMore={loadingMore}
//             submissions={submissions}
//             onLoadMore={handleLoadMore}
//             currentStatus={currentStatus}
//             setSubmissions={setSubmissions}
//             onStatusChange={handleStatusChange}
//             selectedSubmission={selectedSubmission}
//             setSelectedSubmission={setSelectedSubmission}
//             activeFilters={activeFilters}
//             onFiltersChange={handleFiltersChange}
//           />
//         </WrapperContainer>

//         {selectedSubmission ? (
//           <ReviewDetailsPanel
//             onReview={handleReview}
//             reviewComment={reviewComment}
//             submission={selectedSubmission}
//             setReviewComment={setReviewComment}
//             onSubmissionUpdate={handleSubmissionUpdate}
//           />
//         ) : (
//           <NoSubmissionSelected
//             currentStatus={currentStatus}
//             submissionCount={submissions.length}
//           />
//         )}
//       </div>
//     </MainPageScroll>
//   );
// };

// export default AdminReviewPage;

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

const API_CONFIG = {
  PAGINATION_LIMIT: 10,
  DEFAULT_ORDER: "desc",
  DEFAULT_STATUS: "pending",
};

const DEFAULT_FILTERS = {
  primaryFilterKey: null,
  primaryFilterValue: null,
  status: API_CONFIG.DEFAULT_STATUS,
  order: API_CONFIG.DEFAULT_ORDER,
};

const FILTER_TYPES = {
  QUEST: "quest_id",
  CATEGORY: "category_id",
  REVIEWER: "reviewer_id",
  AMBASSADOR: "ambassador_id",
};

const SUBMISSION_STATUS = {
  ALL: "all",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  FLAGGED: "flagged",
  HIGHLIGHTED: "highlighted",
};

/**
 * Builds the API URL based on pod ID and active filters
 * @param {string} podId - The current pod identifier
 * @param {Object} filters - Active filter configuration
 * @returns {string} The constructed API endpoint URL
 */
const buildApiUrl = (podId, filters) => {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/submissions/pod/${podId}`;

  // Primary filter takes precedence
  if (filters.primaryFilterKey && filters.primaryFilterValue) {
    const filterRoutes = {
      [FILTER_TYPES.QUEST]: `quest/${filters.primaryFilterValue}`,
      [FILTER_TYPES.CATEGORY]: `category/${filters.primaryFilterValue}`,
      [FILTER_TYPES.REVIEWER]: `reviewed-by/${filters.primaryFilterValue}`,
      [FILTER_TYPES.AMBASSADOR]: `ambassador/${filters.primaryFilterValue}`,
    };

    const route = filterRoutes[filters.primaryFilterKey];
    if (route) {
      return `${baseUrl}/${route}`;
    }
  }

  // Fallback to status-based filtering
  const { status } = filters;

  if (status === SUBMISSION_STATUS.ALL) {
    return baseUrl;
  }

  if (status === SUBMISSION_STATUS.FLAGGED) {
    return `${baseUrl}/flagged`;
  }

  if (Object.values(SUBMISSION_STATUS).includes(status)) {
    return `${baseUrl}/${status}`;
  }

  // Default to pending
  return `${baseUrl}/${SUBMISSION_STATUS.PENDING}`;
};

/**
 * Generic API request handler with error handling
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Parsed JSON response
 */

const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      cache: "no-store",
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

/**
 * Builds query parameters for submission fetch requests
 * @param {Object} filters - Active filter configuration
 * @param {string|null} lastEvaluatedKey - Pagination cursor
 * @returns {URLSearchParams} Constructed query parameters
 */

const buildQueryParams = (filters, lastEvaluatedKey = null) => {
  const params = new URLSearchParams({
    limit: String(API_CONFIG.PAGINATION_LIMIT),
    order: filters.order || API_CONFIG.DEFAULT_ORDER,
  });

  // Add review_status for primary filtered endpoints
  if (filters.primaryFilterKey && filters.status !== SUBMISSION_STATUS.ALL) {
    params.append("review_status", filters.status);
  }

  // Add status parameter for ambassador endpoint (different API contract)
  if (
    filters.primaryFilterKey === FILTER_TYPES.AMBASSADOR &&
    filters.status !== SUBMISSION_STATUS.ALL
  ) {
    params.append("status", filters.status);
  }

  // Add pagination cursor if provided
  if (lastEvaluatedKey) {
    params.append("last_key", lastEvaluatedKey);
  }

  return params;
};

const AdminReviewPage = () => {
  const dispatch = useDispatch();
  const podId = useSelector((state) => state.pods.currentPod);

  // Refs for cleanup and request tracking
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  // Submission data state
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Pagination state
  const [hasMore, setHasMore] = useState(true);
  const [nextKey, setNextKey] = useState(null);

  // Loading states
  const [listLoading, setListLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  // Filter state
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);
  const [currentStatus, setCurrentStatus] = useState(API_CONFIG.DEFAULT_STATUS);

  // Review state
  const [reviewComment, setReviewComment] = useState("");

  const fetchSubmissions = useCallback(
    async (filters, lastEvaluatedKey = null, isLoadMore = false) => {
      if (!podId) return;

      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      try {
        // Set appropriate loading states
        if (!isLoadMore) {
          setListLoading(true);
          setHasMore(true);
          setNextKey(null);
          setSubmissions([]);
          setSelectedSubmission(null);
        } else {
          setLoadingMore(true);
        }

        // Build API request
        const apiUrl = buildApiUrl(podId, filters);
        const params = buildQueryParams(filters, lastEvaluatedKey);

        // Execute request
        const { data } = await apiRequest(`${apiUrl}?${params}`, {
          signal: abortControllerRef.current.signal,
        });

        // Only update state if component is still mounted
        if (!isMountedRef.current) return;

        const newNextKey = data.next_key || null;
        const rawSubmissions = data.submissions || [];
        const newHasMore = newNextKey !== null;

        // Update submissions based on load type
        if (isLoadMore) {
          setSubmissions((prev) => [...prev, ...rawSubmissions]);
        } else {
          setSubmissions(rawSubmissions);
        }

        setNextKey(newNextKey);
        setHasMore(newHasMore);
      } catch (error) {
        // Don't show error for aborted requests
        if (error.name === "AbortError") {
          return;
        }

        console.error("Failed to fetch submissions:", error);

        // Only clear data on initial fetch failure
        if (!isLoadMore && isMountedRef.current) {
          setSubmissions([]);
          setSelectedSubmission(null);
          setHasMore(false);
        }

        // TODO: Show user-friendly error notification
      } finally {
        if (isMountedRef.current) {
          setListLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [podId],
  );

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

  const handleStatusChange = useCallback(
    (status) => {
      const newFilters = {
        ...DEFAULT_FILTERS,
        status,
        order: activeFilters.order, // Preserve order preference
      };

      setCurrentStatus(status);
      setActiveFilters(newFilters);
      setSelectedSubmission(null);
      setReviewComment("");
      fetchSubmissions(newFilters, null, false);
    },
    [activeFilters.order, fetchSubmissions],
  );

  const handleLoadMore = useCallback(() => {
    if (!hasMore || loadingMore || listLoading) return;
    fetchSubmissions(activeFilters, nextKey, true);
  }, [
    activeFilters,
    nextKey,
    hasMore,
    loadingMore,
    listLoading,
    fetchSubmissions,
  ]);

  const handleReview = useCallback(
    async (submissionId, action, comment) => {
      if (!submissionId || !action) {
        console.error("Invalid review parameters");
        return;
      }

      try {
        setReviewLoading(true);

        const response = await apiRequest(
          `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}/review`,
          {
            method: "PATCH",
            body: JSON.stringify({
              action,
              comment: comment?.trim() || undefined,
            }),
          },
        );

        const updatedSubmission = response.data || response;

        // Update submission in list
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.submission_id === submissionId ? updatedSubmission : sub,
          ),
        );

        // Update selected submission if it's the reviewed one
        if (selectedSubmission?.submission_id === submissionId) {
          setSelectedSubmission(updatedSubmission);
        }

        setReviewComment("");

        // TODO: Show success notification
      } catch (error) {
        console.error("Failed to review submission:", error);

        // TODO: Replace with proper toast notification
        alert(
          `Failed to ${action} submission. ${error.message || "Please try again."}`,
        );
      } finally {
        setReviewLoading(false);
      }
    },
    [selectedSubmission?.submission_id],
  );

  const handleSubmissionUpdate = useCallback(
    (updatedSubmission) => {
      if (!updatedSubmission?.submission_id) {
        console.error("Invalid submission update");
        return;
      }

      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.submission_id === updatedSubmission.submission_id
            ? updatedSubmission
            : sub,
        ),
      );

      // Update selected submission if it matches
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

      // Reset to default filters
      setActiveFilters(DEFAULT_FILTERS);
      setCurrentStatus(API_CONFIG.DEFAULT_STATUS);
      fetchSubmissions(DEFAULT_FILTERS, null, false);
    }
  }, [podId, dispatch, fetchSubmissions]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;

      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
            reviewLoading={reviewLoading}
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
