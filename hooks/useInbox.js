// import { useCallback, useState } from "react";

// // Constants
// const REVIEW_STATUS = {
//   APPROVED: "approved",
//   REJECTED: "rejected",
//   HIGHLIGHTED: "highlighted",
// };

// // API functions
// const api = {
//   fetchSubmissions: async (page = 1, limit = 20) => {
//     // TODO: Replace with actual API call
//     // return await fetch(`/api/submissions/reviewed?page=${page}&limit=${limit}`);

//     // Demo data - only reviewed submissions
//     const demoData = [
//       {
//         submission_id: "sub_001",
//         ambassador_id: "amb_123",
//         quest_id: "quest_001",
//         pod_id: "pod_001",
//         category_id: "cat_001",
//         submitted_at: "2025-06-12T10:30:00Z",
//         updated_at: "2025-06-12T12:15:00Z",
//         review_status: REVIEW_STATUS.APPROVED,
//         reviewed_by: "admin_001",
//         reviewed_at: "2025-06-12T12:15:00Z",
//         review_comment: null,
//         rewards: [{ type: "points", amount: 100 }],
//         submission_data: {
//           type: "twitter",
//           content: "Great tweet about NeoPod",
//         },
//         is_read_by_ambassador: false,
//         is_read_by_admin: true,
//         notification_created_at: "2025-06-12T12:15:00Z",
//         quest_name:
//           "Share a Twitter / X thread explaining NeoPod Ambassador Program. (Min 8 Tweets)",
//         ambassador_name: "NooberBoy",
//         reviewed_by: "admin_001",
//       },
//       {
//         submission_id: "sub_002",
//         ambassador_id: "amb_124",
//         quest_id: "quest_002",
//         pod_id: "pod_001",
//         category_id: "cat_002",
//         submitted_at: "2025-06-12T09:45:00Z",
//         updated_at: "2025-06-12T11:30:00Z",
//         review_status: REVIEW_STATUS.APPROVED,
//         reviewed_by: "admin_002",
//         reviewed_at: "2025-06-12T11:30:00Z",
//         review_comment:
//           "Great work! Your content perfectly captures the essence of our program.",
//         rewards: [{ type: "points", amount: 75 }],
//         submission_data: {
//           type: "twitter",
//           content: "NeoPod Ambassador tweet",
//         },
//         is_read_by_ambassador: true,
//         is_read_by_admin: true,
//         notification_created_at: "2025-06-12T11:30:00Z",
//         quest_name: "Share a Tweet on NeoPod Ambassador Program.",
//         ambassador_name: "NooberBoy",
//         reviewed_by: "admin_002",
//       },
//       {
//         submission_id: "sub_003",
//         ambassador_id: "amb_125",
//         quest_id: "quest_003",
//         pod_id: "pod_001",
//         category_id: "cat_001",
//         submitted_at: "2025-06-12T08:20:00Z",
//         updated_at: "2025-06-12T10:45:00Z",
//         review_status: REVIEW_STATUS.REJECTED,
//         reviewed_by: "admin_001",
//         reviewed_at: "2025-06-12T10:45:00Z",
//         review_comment:
//           "The content doesn't meet our quality standards. Please ensure your submission includes all required elements and follows our guidelines. Feel free to resubmit with improvements.",
//         rewards: [],
//         submission_data: {
//           type: "twitter",
//           content: "Incomplete tweet submission",
//         },
//         is_read_by_ambassador: false,
//         is_read_by_admin: true,
//         notification_created_at: "2025-06-12T10:45:00Z",
//         quest_name: "Share a Tweet on NeoPod Ambassador Program.",
//         ambassador_name: "NooberBoy",
//         reviewed_by: "admin_001",
//       },
//       {
//         submission_id: "sub_004",
//         ambassador_id: "amb_126",
//         quest_id: "quest_004",
//         pod_id: "pod_001",
//         category_id: "cat_003",
//         submitted_at: "2025-06-12T07:15:00Z",
//         updated_at: "2025-06-12T09:30:00Z",
//         review_status: REVIEW_STATUS.HIGHLIGHTED,
//         reviewed_by: "admin_003",
//         reviewed_at: "2025-06-12T09:30:00Z",
//         review_comment:
//           "Outstanding work! This submission goes above and beyond expectations. The content is exceptionally well-researched, highly engaging, and perfectly represents our community values. This is exactly the kind of quality we love to see!",
//         rewards: [{ type: "points", amount: 200 }],
//         submission_data: {
//           type: "twitter",
//           content: "Educational thread about NEO",
//         },
//         is_read_by_ambassador: false,
//         is_read_by_admin: true,
//         notification_created_at: "2025-06-12T09:30:00Z",
//         quest_name:
//           "Share a Twitter / X thread explaining NeoPod Ambassador Program. (Min 8 Tweets)",
//         ambassador_name: "NooberBoy",
//         reviewed_by: "admin_003",
//       },
//       {
//         submission_id: "sub_005",
//         ambassador_id: "amb_127",
//         quest_id: "quest_005",
//         pod_id: "pod_001",
//         category_id: "cat_002",
//         submitted_at: "2025-06-11T20:30:00Z",
//         updated_at: "2025-06-12T07:45:00Z",
//         review_status: REVIEW_STATUS.APPROVED,
//         reviewed_by: "admin_001",
//         reviewed_at: "2025-06-12T07:45:00Z",
//         review_comment:
//           "Very informative and well-structured content. Great work!",
//         rewards: [{ type: "points", amount: 85 }],
//         submission_data: { type: "twitter", content: "Informative NEO tweet" },
//         is_read_by_ambassador: true,
//         is_read_by_admin: true,
//         notification_created_at: "2025-06-12T07:45:00Z",
//         quest_name: "Share a Tweet on NeoPod Ambassador Program.",
//         ambassador_name: "NooberBoy",
//         reviewed_by: "admin_001",
//       },
//     ];

//     return new Promise((resolve) => {
//       setTimeout(
//         () =>
//           resolve({
//             data: demoData,
//             total: demoData.length,
//             hasMore: false,
//           }),
//         800,
//       );
//     });
//   },

//   markAsRead: async (submissionId) => {
//     // TODO: Replace with actual API call
//     // return await fetch(`/api/submissions/${submissionId}/mark-read`, { method: 'PATCH' });
//     return new Promise((resolve) => setTimeout(resolve, 300));
//   },

//   markAllAsRead: async () => {
//     // TODO: Replace with actual API call
//     // return await fetch('/api/submissions/mark-all-read', { method: 'PATCH' });
//     return new Promise((resolve) => setTimeout(resolve, 500));
//   },
// };

// export const useInbox = () => {
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submissions, setSubmissions] = useState([]);
//   const [markingAllRead, setMarkingAllRead] = useState(false);

//   const loadSubmissions = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await api.fetchSubmissions();
//       setSubmissions(response.data);
//     } catch (err) {
//       setError(err.message || "Failed to load notifications");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const markAsRead = useCallback(async (submissionId) => {
//     try {
//       // Optimistic update
//       setSubmissions((prev) =>
//         prev.map((submission) =>
//           submission.submission_id === submissionId
//             ? { ...submission, is_read_by_ambassador: true }
//             : submission,
//         ),
//       );

//       await api.markAsRead(submissionId);
//     } catch (err) {
//       // Rollback on error
//       setSubmissions((prev) =>
//         prev.map((submission) =>
//           submission.submission_id === submissionId
//             ? { ...submission, is_read_by_ambassador: false }
//             : submission,
//         ),
//       );
//       console.error("Failed to mark as read:", err);
//     }
//   }, []);

//   const markAllAsRead = useCallback(async () => {
//     let originalSubmissions;
//     try {
//       setMarkingAllRead(true);

//       // Store original state for rollback
//       originalSubmissions = submissions;

//       // Optimistic update
//       setSubmissions((prev) =>
//         prev.map((submission) => ({
//           ...submission,
//           is_read_by_ambassador: true,
//         })),
//       );

//       await api.markAllAsRead();
//     } catch (err) {
//       // Rollback on error
//       setSubmissions(originalSubmissions);
//       console.error("Failed to mark all as read:", err);
//     } finally {
//       setMarkingAllRead(false);
//     }
//   }, [submissions]);

//   return {
//     // Data
//     submissions,
//     loading,
//     error,
//     markingAllRead,

//     // Actions
//     loadSubmissions,
//     markAsRead,
//     markAllAsRead,
//   };
// };

import { useCallback, useState, useRef, useEffect } from "react";

// Constants
const REVIEW_STATUS = {
  APPROVED: "approved",
  REJECTED: "rejected",
  HIGHLIGHTED: "highlighted",
  PENDING: "pending",
};

const CACHE_DURATION = 60000; // 1 minute cache
const POLLING_INTERVAL = 120000; // 2 minutes

// API functions
const api = {
  fetchSubmissions: async (lastKey = null, limit = 20) => {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/inbox`);
    url.searchParams.append("limit", limit.toString());

    if (lastKey) {
      url.searchParams.append("last_key", lastKey);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "success") {
      return {
        data:
          data.data.notifications?.map((notification) => ({
            ...notification,
            // Convert string to boolean for frontend
            is_read_by_ambassador:
              notification.is_read_by_ambassador === "true" ||
              notification.is_read_by_ambassador === true,
          })) || [],
        pagination: data.data.pagination || {},
        summary: data.data.summary || {},
        meta: data.data.meta || {},
      };
    } else {
      throw new Error(data.message || "Failed to load inbox");
    }
  },

  markAsRead: async (submissionId) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/inbox/${submissionId}/read-by-ambassador`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  markAllAsRead: async (submissionIds) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/inbox/mark-multiple-read`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ submission_ids: submissionIds }),
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getUnreadCount: async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/inbox/unread-count`,
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

    const data = await response.json();
    return data.data?.count || 0;
  },
};

export const useInbox = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [pagination, setPagination] = useState({});
  const [summary, setSummary] = useState({});

  // Cache management
  const cacheRef = useRef({
    data: null,
    timestamp: 0,
    nextKey: null,
  });

  // Polling management
  const pollingIntervalRef = useRef(null);
  const lastFetchRef = useRef(0);

  // Check if cache is valid
  const isCacheValid = useCallback(() => {
    const now = Date.now();
    return (
      cacheRef.current.data && now - cacheRef.current.timestamp < CACHE_DURATION
    );
  }, []);

  // Update cache
  const updateCache = useCallback(
    (data, append = false) => {
      cacheRef.current = {
        data: append ? [...(cacheRef.current.data || []), ...data] : data,
        timestamp: Date.now(),
        nextKey: pagination.next_key,
      };
    },
    [pagination.next_key],
  );

  // Load submissions with caching
  const loadSubmissions = useCallback(
    async (forceRefresh = false) => {
      // Use cache if valid and not forcing refresh
      if (!forceRefresh && isCacheValid() && cacheRef.current.data) {
        console.log("📦 Using cached inbox data");
        setSubmissions(cacheRef.current.data);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        lastFetchRef.current = Date.now();

        console.log("🔄 Fetching fresh inbox data");
        const response = await api.fetchSubmissions();

        setSubmissions(response.data);
        setPagination(response.pagination);
        setSummary(response.summary);

        // Update cache
        updateCache(response.data);
      } catch (err) {
        console.error("Error loading submissions:", err);
        setError(err.message || "Failed to load notifications");

        // Use cache as fallback if available
        if (cacheRef.current.data) {
          console.log("📦 Using cached data as fallback");
          setSubmissions(cacheRef.current.data);
        }
      } finally {
        setLoading(false);
      }
    },
    [isCacheValid, updateCache],
  );

  // Load more submissions (pagination)
  const loadMoreSubmissions = useCallback(async () => {
    if (!pagination.next_key || loadingMore) {
      return;
    }

    try {
      setLoadingMore(true);
      setError(null);

      console.log("📄 Loading more submissions...");
      const response = await api.fetchSubmissions(pagination.next_key);

      // Append new data
      const newSubmissions = [...submissions, ...response.data];
      setSubmissions(newSubmissions);
      setPagination(response.pagination);

      // Update cache with combined data
      updateCache(newSubmissions);
    } catch (err) {
      console.error("Error loading more submissions:", err);
      setError(err.message || "Failed to load more notifications");
    } finally {
      setLoadingMore(false);
    }
  }, [submissions, pagination.next_key, loadingMore, updateCache]);

  // Refresh submissions (force fresh data)
  const refreshSubmissions = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      console.log("🔄 Refreshing inbox data");
      const response = await api.fetchSubmissions();

      setSubmissions(response.data);
      setPagination(response.pagination);
      setSummary(response.summary);

      // Update cache
      updateCache(response.data);
    } catch (err) {
      console.error("Error refreshing submissions:", err);
      setError(err.message || "Failed to refresh notifications");
    } finally {
      setRefreshing(false);
    }
  }, [updateCache]);

  // Start/stop polling
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(() => {
      // Only poll if tab is visible and not currently loading
      if (!document.hidden && !loading && !loadingMore) {
        console.log("⏰ Polling inbox updates");
        loadSubmissions(true); // Force refresh on poll
      }
    }, POLLING_INTERVAL);

    console.log("▶️ Started inbox polling (2 minutes interval)");
  }, [loading, loadingMore, loadSubmissions]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      console.log("⏹️ Stopped inbox polling");
    }
  }, []);

  // Mark single submission as read
  const markAsRead = useCallback(
    async (submissionId) => {
      try {
        // Optimistic update
        const updatedSubmissions = submissions.map((submission) =>
          submission.submission_id === submissionId
            ? { ...submission, is_read_by_ambassador: true }
            : submission,
        );

        setSubmissions(updatedSubmissions);

        // Update cache
        updateCache(updatedSubmissions);

        await api.markAsRead(submissionId);
      } catch (err) {
        console.error("Failed to mark as read:", err);
        // Rollback on error
        setSubmissions(submissions);
        // Revert cache
        updateCache(submissions);
      }
    },
    [submissions, updateCache],
  );

  // Mark all submissions as read
  const markAllAsRead = useCallback(async () => {
    const unreadSubmissions = submissions.filter(
      (s) => !s.is_read_by_ambassador,
    );

    if (unreadSubmissions.length === 0) return;

    const originalSubmissions = submissions;

    try {
      setMarkingAllRead(true);

      // Optimistic update
      const updatedSubmissions = submissions.map((submission) => ({
        ...submission,
        is_read_by_ambassador: true,
      }));

      setSubmissions(updatedSubmissions);

      // Update cache
      updateCache(updatedSubmissions);

      const submissionIds = unreadSubmissions.map((s) => s.submission_id);
      await api.markAllAsRead(submissionIds);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      // Rollback on error
      setSubmissions(originalSubmissions);
      // Revert cache
      updateCache(originalSubmissions);
    } finally {
      setMarkingAllRead(false);
    }
  }, [submissions, updateCache]);

  // Get unread count (for polling/badges)
  const getUnreadCount = useCallback(async () => {
    try {
      return await api.getUnreadCount();
    } catch (err) {
      console.error("Failed to get unread count:", err);
      return 0;
    }
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    cacheRef.current = {
      data: null,
      timestamp: 0,
      nextKey: null,
    };
    console.log("🗑️ Cleared inbox cache");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    // Data
    error,
    loading,
    summary,
    pagination,
    refreshing,
    loadingMore,
    submissions,
    markingAllRead,

    // Actions
    markAsRead,
    clearCache,
    markAllAsRead,
    getUnreadCount,
    loadSubmissions,
    refreshSubmissions,
    loadMoreSubmissions,

    // Polling controls
    startPolling,
    stopPolling,

    // Constants
    REVIEW_STATUS,

    // Computed values
    hasMore: !!pagination.next_key,
    canLoadMore: !!pagination.next_key && !loadingMore,
    lastFetchTime: lastFetchRef.current,
    cacheAge: cacheRef.current.timestamp
      ? Date.now() - cacheRef.current.timestamp
      : 0,
  };
};
