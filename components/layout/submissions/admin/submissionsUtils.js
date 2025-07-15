/**
 * Calculate filter counts for different submission statuses
 * @param {Array} submissions - Array of submission objects
 * @returns {Object} Object containing counts for each status
 */
export const calculateFilterCounts = (submissions) => {
  const counts = {
    all: submissions.length,
    pending: 0,
    approved: 0,
    rejected: 0,
    highlighted: 0,
    flagged: 0,
  };

  submissions.forEach((submission) => {
    // Count by review status
    if (submission.review_status === "pending") counts.pending++;
    else if (submission.review_status === "approved") counts.approved++;
    else if (submission.review_status === "rejected") counts.rejected++;
    else if (submission.review_status === "highlighted") counts.highlighted++;

    // Count flagged submissions
    if (submission.is_flagged) counts.flagged++;
  });

  return counts;
};

/**
 * Get unique categories from submissions
 * @param {Array} submissions - Array of submission objects
 * @returns {Array} Array of unique category names
 */
export const getUniqueCategories = (submissions) => {
  const categories = new Set();

  submissions.forEach((submission) => {
    if (submission.category_name) {
      categories.add(submission.category_name);
    }
  });

  return Array.from(categories).sort();
};

/**
 * Format time ago string
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Formatted time ago string
 */
export const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 30) return `${diffInDays}d ago`;

  return date.toLocaleDateString();
};

/**
 * Get status configuration for styling
 * @param {string} status - Review status
 * @returns {Object} Status configuration object
 */
export const getStatusConfig = (status) => {
  const configs = {
    pending: {
      color: "gray",
      bgColor: "bg-gray-900/50",
      borderColor: "border-gray-700",
      textColor: "text-gray-400",
    },
    approved: {
      color: "success",
      bgColor: "bg-green-900/30",
      borderColor: "border-green-700",
      textColor: "text-green-400",
    },
    rejected: {
      color: "danger",
      bgColor: "bg-red-900/30",
      borderColor: "border-red-700",
      textColor: "text-red-400",
    },
    highlighted: {
      color: "warning",
      bgColor: "bg-yellow-900/30",
      borderColor: "border-yellow-700",
      textColor: "text-yellow-400",
    },
  };

  return configs[status] || configs.pending;
};

/**
 * Debounce function for search inputs
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Filter submissions based on search criteria
 * @param {Array} submissions - Array of submissions
 * @param {Object} filters - Filter object
 * @returns {Array} Filtered submissions
 */
export const filterSubmissions = (submissions, filters) => {
  return submissions.filter((submission) => {
    // Status filter
    if (filters.status && filters.status !== "all") {
      if (filters.status === "flagged") {
        if (!submission.is_flagged) return false;
      } else if (submission.review_status !== filters.status) {
        return false;
      }
    }

    // User filter
    if (filters.user) {
      if (
        !submission.ambassador_name
          ?.toLowerCase()
          .includes(filters.user.toLowerCase())
      ) {
        return false;
      }
    }

    // Quest filter
    if (filters.quest) {
      if (
        !submission.quest_name
          ?.toLowerCase()
          .includes(filters.quest.toLowerCase())
      ) {
        return false;
      }
    }

    // Category filter
    if (filters.category && filters.category !== "all") {
      if (submission.category_name !== filters.category) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Sort submissions by priority (unread first, then by date)
 * @param {Array} submissions - Array of submissions
 * @returns {Array} Sorted submissions
 */
export const sortSubmissionsByPriority = (submissions) => {
  return [...submissions].sort((a, b) => {
    // Unread submissions first
    if (a.is_read_by_admin !== b.is_read_by_admin) {
      return a.is_read_by_admin ? 1 : -1;
    }

    // Then by submitted date (newest first)
    return new Date(b.submitted_at) - new Date(a.submitted_at);
  });
};
