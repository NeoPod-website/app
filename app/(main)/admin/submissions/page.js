// "use client";

// import { useSelector } from "react-redux";
// import { useState, useEffect, useCallback } from "react";

// import MainPageScroll from "@/components/common/MainPageScroll";
// import WrapperContainer from "@/components/common/WrapperContainer";
// import SubmissionsList from "@/components/layout/submissions/admin/SubmissionsList";
// import { NoPodSelected } from "@/components/ui/loader/submission/admin/EmptySubmissionStates";
// import NoSubmissionSelected from "@/components/layout/submissions/admin/NoSubmissionSelected";
// import ReviewDetailsPanel from "@/components/layout/submissions/admin/details/ReviewDetailsPanel";

// // API utility functions
// const buildApiUrl = (podId, status) => {
//   const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/submissions/pod/${podId}`;

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
//   const podId = useSelector((state) => state.pods.currentPod);

//   // Pagination state
//   const [hasMore, setHasMore] = useState(true);
//   const [nextKey, setNextKey] = useState(null);

//   // Core state
//   const [submissions, setSubmissions] = useState([]);
//   const [currentStatus, setCurrentStatus] = useState("pending");
//   const [selectedSubmission, setSelectedSubmission] = useState(null);

//   // Loading states
//   const [listLoading, setListLoading] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);

//   // Review functionality state
//   const [reviewComment, setReviewComment] = useState("");
//   const [reviewLoading, setReviewLoading] = useState(false);

//   // Fetch submissions from API
//   const fetchSubmissions = useCallback(
//     async (status, lastEvaluatedKey = null, isLoadMore = false) => {
//       if (!podId) return;

//       try {
//         // Set loading states
//         if (!isLoadMore) {
//           setHasMore(true);
//           setNextKey(null);
//           setSubmissions([]);
//           setListLoading(true);
//           // Clear selection when fetching new list
//           setSelectedSubmission(null);
//         } else {
//           setLoadingMore(true);
//         }

//         // Build API URL and params
//         const apiUrl = buildApiUrl(podId, status);
//         const params = new URLSearchParams({ limit: "10" });

//         if (lastEvaluatedKey) {
//           params.append("last_key", lastEvaluatedKey);
//         }

//         // Make API request
//         const { data } = await apiRequest(`${apiUrl}?${params}`);

//         // Extract response data
//         const newNextKey = data.next_key || null;
//         const rawSubmissions = data.submissions || [];

//         const newHasMore = newNextKey !== null;

//         // Update state
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

//   // Handle status filter change
//   const handleStatusChange = useCallback(
//     (status) => {
//       setCurrentStatus(status);
//       setSelectedSubmission(null); // Clear selection immediately
//       setReviewComment(""); // Clear any pending review comment
//       fetchSubmissions(status, null, false);
//     },
//     [fetchSubmissions],
//   );

//   // Handle load more
//   const handleLoadMore = useCallback(() => {
//     if (!hasMore || loadingMore) return;
//     fetchSubmissions(currentStatus, nextKey, true);
//   }, [currentStatus, nextKey, hasMore, loadingMore, fetchSubmissions]);

//   // Handle review submission
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

//         // Update the submission in local state
//         const updatedSubmission = response.data || response;

//         setSubmissions((prev) =>
//           prev.map((sub) =>
//             sub.submission_id === submissionId ? updatedSubmission : sub,
//           ),
//         );

//         // Update selected submission if it's the one being reviewed
//         if (selectedSubmission?.submission_id === submissionId) {
//           setSelectedSubmission(updatedSubmission);
//         }

//         // Clear review comment
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

//   // Update submission in local state after review
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

//   // Initial load
//   useEffect(() => {
//     if (podId) {
//       fetchSubmissions(currentStatus, null, false);
//     }
//   }, [podId, fetchSubmissions, currentStatus]);

//   // Early return if no pod selected
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
import { useState, useEffect, useCallback } from "react";

import MainPageScroll from "@/components/common/MainPageScroll";
import WrapperContainer from "@/components/common/WrapperContainer";
import SubmissionsList from "@/components/layout/submissions/admin/SubmissionsList";
import { NoPodSelected } from "@/components/ui/loader/submission/admin/EmptySubmissionStates";
import NoSubmissionSelected from "@/components/layout/submissions/admin/NoSubmissionSelected";
import ReviewDetailsPanel from "@/components/layout/submissions/admin/details/ReviewDetailsPanel";

import { setHighlightedSubmissionsData } from "@/redux/slice/questSlice";

// API utility functions (unchanged)
const buildApiUrl = (podId, status) => {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/submissions/pod/${podId}`;

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
  const dispatch = useDispatch(); // ADD THIS
  const podId = useSelector((state) => state.pods.currentPod);

  // All your existing state (unchanged)
  const [hasMore, setHasMore] = useState(true);
  const [nextKey, setNextKey] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [currentStatus, setCurrentStatus] = useState("pending");
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const [listLoading, setListLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  // All your existing functions (unchanged)
  const fetchSubmissions = useCallback(
    async (status, lastEvaluatedKey = null, isLoadMore = false) => {
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

        const apiUrl = buildApiUrl(podId, status);
        const params = new URLSearchParams({ limit: "10" });

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

  const handleStatusChange = useCallback(
    (status) => {
      setCurrentStatus(status);
      setSelectedSubmission(null);
      setReviewComment("");
      fetchSubmissions(status, null, false);
    },
    [fetchSubmissions],
  );

  const handleLoadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    fetchSubmissions(currentStatus, nextKey, true);
  }, [currentStatus, nextKey, hasMore, loadingMore, fetchSubmissions]);

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

  // ONLY CHANGE: Update the useEffect to clear highlights cache
  useEffect(() => {
    if (podId) {
      // Clear highlight cache when pod changes to prevent stale data
      dispatch(setHighlightedSubmissionsData([]));

      fetchSubmissions(currentStatus, null, false);
    }
  }, [podId, dispatch, fetchSubmissions, currentStatus]);

  // Everything else unchanged
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
