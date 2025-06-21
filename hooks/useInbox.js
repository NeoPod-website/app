import { useCallback, useState } from "react";

// Constants
const REVIEW_STATUS = {
  APPROVED: "approved",
  REJECTED: "rejected",
  HIGHLIGHTED: "highlighted",
};

// API functions
const api = {
  fetchSubmissions: async (page = 1, limit = 20) => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/submissions/reviewed?page=${page}&limit=${limit}`);

    // Demo data - only reviewed submissions
    const demoData = [
      {
        submission_id: "sub_001",
        ambassador_id: "amb_123",
        quest_id: "quest_001",
        pod_id: "pod_001",
        category_id: "cat_001",
        submitted_at: "2025-06-12T10:30:00Z",
        updated_at: "2025-06-12T12:15:00Z",
        review_status: REVIEW_STATUS.APPROVED,
        reviewed_by: "admin_001",
        reviewed_at: "2025-06-12T12:15:00Z",
        review_comment: null,
        rewards: [{ type: "points", amount: 100 }],
        submission_data: {
          type: "twitter",
          content: "Great tweet about NeoPod",
        },
        is_read_by_ambassador: false,
        is_read_by_admin: true,
        notification_created_at: "2025-06-12T12:15:00Z",
        quest_name:
          "Share a Twitter / X thread explaining NeoPod Ambassador Program. (Min 8 Tweets)",
        ambassador_name: "NooberBoy",
        reviewed_by: "admin_001",
      },
      {
        submission_id: "sub_002",
        ambassador_id: "amb_124",
        quest_id: "quest_002",
        pod_id: "pod_001",
        category_id: "cat_002",
        submitted_at: "2025-06-12T09:45:00Z",
        updated_at: "2025-06-12T11:30:00Z",
        review_status: REVIEW_STATUS.APPROVED,
        reviewed_by: "admin_002",
        reviewed_at: "2025-06-12T11:30:00Z",
        review_comment:
          "Great work! Your content perfectly captures the essence of our program.",
        rewards: [{ type: "points", amount: 75 }],
        submission_data: {
          type: "twitter",
          content: "NeoPod Ambassador tweet",
        },
        is_read_by_ambassador: true,
        is_read_by_admin: true,
        notification_created_at: "2025-06-12T11:30:00Z",
        quest_name: "Share a Tweet on NeoPod Ambassador Program.",
        ambassador_name: "NooberBoy",
        reviewed_by: "admin_002",
      },
      {
        submission_id: "sub_003",
        ambassador_id: "amb_125",
        quest_id: "quest_003",
        pod_id: "pod_001",
        category_id: "cat_001",
        submitted_at: "2025-06-12T08:20:00Z",
        updated_at: "2025-06-12T10:45:00Z",
        review_status: REVIEW_STATUS.REJECTED,
        reviewed_by: "admin_001",
        reviewed_at: "2025-06-12T10:45:00Z",
        review_comment:
          "The content doesn't meet our quality standards. Please ensure your submission includes all required elements and follows our guidelines. Feel free to resubmit with improvements.",
        rewards: [],
        submission_data: {
          type: "twitter",
          content: "Incomplete tweet submission",
        },
        is_read_by_ambassador: false,
        is_read_by_admin: true,
        notification_created_at: "2025-06-12T10:45:00Z",
        quest_name: "Share a Tweet on NeoPod Ambassador Program.",
        ambassador_name: "NooberBoy",
        reviewed_by: "admin_001",
      },
      {
        submission_id: "sub_004",
        ambassador_id: "amb_126",
        quest_id: "quest_004",
        pod_id: "pod_001",
        category_id: "cat_003",
        submitted_at: "2025-06-12T07:15:00Z",
        updated_at: "2025-06-12T09:30:00Z",
        review_status: REVIEW_STATUS.HIGHLIGHTED,
        reviewed_by: "admin_003",
        reviewed_at: "2025-06-12T09:30:00Z",
        review_comment:
          "Outstanding work! This submission goes above and beyond expectations. The content is exceptionally well-researched, highly engaging, and perfectly represents our community values. This is exactly the kind of quality we love to see!",
        rewards: [{ type: "points", amount: 200 }],
        submission_data: {
          type: "twitter",
          content: "Educational thread about NEO",
        },
        is_read_by_ambassador: false,
        is_read_by_admin: true,
        notification_created_at: "2025-06-12T09:30:00Z",
        quest_name:
          "Share a Twitter / X thread explaining NeoPod Ambassador Program. (Min 8 Tweets)",
        ambassador_name: "NooberBoy",
        reviewed_by: "admin_003",
      },
      {
        submission_id: "sub_005",
        ambassador_id: "amb_127",
        quest_id: "quest_005",
        pod_id: "pod_001",
        category_id: "cat_002",
        submitted_at: "2025-06-11T20:30:00Z",
        updated_at: "2025-06-12T07:45:00Z",
        review_status: REVIEW_STATUS.APPROVED,
        reviewed_by: "admin_001",
        reviewed_at: "2025-06-12T07:45:00Z",
        review_comment:
          "Very informative and well-structured content. Great work!",
        rewards: [{ type: "points", amount: 85 }],
        submission_data: { type: "twitter", content: "Informative NEO tweet" },
        is_read_by_ambassador: true,
        is_read_by_admin: true,
        notification_created_at: "2025-06-12T07:45:00Z",
        quest_name: "Share a Tweet on NeoPod Ambassador Program.",
        ambassador_name: "NooberBoy",
        reviewed_by: "admin_001",
      },
    ];

    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            data: demoData,
            total: demoData.length,
            hasMore: false,
          }),
        800,
      );
    });
  },

  markAsRead: async (submissionId) => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/submissions/${submissionId}/mark-read`, { method: 'PATCH' });
    return new Promise((resolve) => setTimeout(resolve, 300));
  },

  markAllAsRead: async () => {
    // TODO: Replace with actual API call
    // return await fetch('/api/submissions/mark-all-read', { method: 'PATCH' });
    return new Promise((resolve) => setTimeout(resolve, 500));
  },
};

export const useInbox = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [markingAllRead, setMarkingAllRead] = useState(false);

  const loadSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.fetchSubmissions();
      setSubmissions(response.data);
    } catch (err) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (submissionId) => {
    try {
      // Optimistic update
      setSubmissions((prev) =>
        prev.map((submission) =>
          submission.submission_id === submissionId
            ? { ...submission, is_read_by_ambassador: true }
            : submission,
        ),
      );

      await api.markAsRead(submissionId);
    } catch (err) {
      // Rollback on error
      setSubmissions((prev) =>
        prev.map((submission) =>
          submission.submission_id === submissionId
            ? { ...submission, is_read_by_ambassador: false }
            : submission,
        ),
      );
      console.error("Failed to mark as read:", err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    let originalSubmissions;
    try {
      setMarkingAllRead(true);

      // Store original state for rollback
      originalSubmissions = submissions;

      // Optimistic update
      setSubmissions((prev) =>
        prev.map((submission) => ({
          ...submission,
          is_read_by_ambassador: true,
        })),
      );

      await api.markAllAsRead();
    } catch (err) {
      // Rollback on error
      setSubmissions(originalSubmissions);
      console.error("Failed to mark all as read:", err);
    } finally {
      setMarkingAllRead(false);
    }
  }, [submissions]);

  return {
    // Data
    submissions,
    loading,
    error,
    markingAllRead,

    // Actions
    loadSubmissions,
    markAsRead,
    markAllAsRead,
  };
};
