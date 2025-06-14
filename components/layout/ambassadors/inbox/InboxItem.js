import {
  StarIcon,
  EyeOffIcon,
  XCircleIcon,
  CheckCircleIcon,
} from "lucide-react";
import React from "react";

const REVIEW_STATUS = {
  APPROVED: "approved",
  REJECTED: "rejected",
  HIGHLIGHTED: "highlighted",
};

const TRUNCATE_LENGTH = 150;
const ANIMATION_DELAY = 100;

const getTimeAgo = (timestamp) => {
  const now = new Date();
  const submittedDate = new Date(timestamp);

  const diffInMs = now.getTime() - submittedDate.getTime();

  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  } else if (diffInDays === 1) {
    return "1 day ago";
  } else {
    return submittedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
};

const getStatusConfig = (status) => {
  const configs = {
    [REVIEW_STATUS.APPROVED]: {
      text: "Approved",
      icon: CheckCircleIcon,
      textColor: "text-green-400",
      iconColor: "text-green-400",
      borderColor: "border-l-green-500",
      bgGradient: "bg-gradient-to-r from-green-500/20 to-transparent",
    },
    [REVIEW_STATUS.REJECTED]: {
      text: "Rejected",
      icon: XCircleIcon,
      textColor: "text-red-400",
      iconColor: "text-red-400",
      borderColor: "border-l-red-500",
      bgGradient: "bg-gradient-to-r from-red-500/20 to-transparent",
    },
    [REVIEW_STATUS.HIGHLIGHTED]: {
      icon: StarIcon,
      text: "Highlighted",
      textColor: "text-yellow-400",
      iconColor: "text-yellow-400",
      borderColor: "border-l-yellow-500",
      bgGradient: "bg-gradient-to-r from-yellow-500/20 to-transparent",
    },
  };

  return (
    configs[status] || {
      icon: null,
      text: "Unknown",
      textColor: "text-gray-400",
      iconColor: "text-gray-400",
      borderColor: "border-l-gray-500",
      bgGradient: "bg-gradient-to-r from-gray-500/20 to-transparent",
    }
  );
};

const truncateText = (text, maxLength = TRUNCATE_LENGTH) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const InboxItem = React.memo(
  ({
    index,
    isVisible,
    submission,
    isExpanded,
    onMarkAsRead,
    onToggleExpanded,
  }) => {
    const statusConfig = getStatusConfig(submission.review_status);

    const hasLongComment =
      submission.review_comment &&
      submission.review_comment.length > TRUNCATE_LENGTH;

    const StatusIcon = statusConfig.icon;
    const isUnread = !submission.is_read_by_ambassador;

    return (
      <div
        className={`group relative overflow-hidden rounded-xl border-l-4 p-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${statusConfig.borderColor} ${statusConfig.bgGradient} ${
          isUnread
            ? "bg-gray-800/90 shadow-md ring-1 ring-blue-500/25"
            : "bg-gray-800/50"
        }`}
        style={{
          animationDelay: `${index * ANIMATION_DELAY}ms`,
          animation: isVisible ? `slideInLeft 0.5s ease-out forwards` : "none",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {isUnread && (
          <div className="absolute right-4 top-4">
            <div className="bg-blue-500 h-3 w-3 animate-pulse rounded-full shadow-lg shadow-blue-500/50" />
          </div>
        )}

        <div className="relative flex items-start gap-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-md transition-all duration-200 ${
              isUnread
                ? "bg-gradient-to-br from-blue-500 to-blue-600 ring-2 ring-blue-400/30"
                : "bg-gradient-to-br from-gray-600 to-gray-700"
            }`}
          >
            {submission.reviewed_by?.charAt(0) || "A"}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-white transition-all duration-200">
                  {submission.reviewed_by}
                </span>

                <span className="text-sm text-gray-200">
                  reviewed your submission:
                </span>

                <div className="flex items-center gap-1">
                  {StatusIcon && (
                    <StatusIcon
                      className={`h-4 w-4 ${statusConfig.iconColor}`}
                    />
                  )}
                  <span
                    className={`text-sm font-semibold ${statusConfig.textColor}`}
                  >
                    {statusConfig.text}
                  </span>
                </div>

                {submission.review_status === REVIEW_STATUS.HIGHLIGHTED && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400 ring-1 ring-yellow-500/30">
                    <StarIcon className="h-3 w-3 fill-current" />
                    Featured
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="whitespace-nowrap text-xs text-gray-200">
                  {getTimeAgo(submission.reviewed_at)}
                </span>

                {isUnread && (
                  <button
                    title="Mark as read"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(submission.submission_id);
                    }}
                    className="hover:bg-blue-500/20 rounded-full p-1.5 text-blue-400 transition-all duration-200 hover:scale-110 hover:text-blue-300"
                  >
                    <EyeOffIcon className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            <p
              className={`mt-2 text-sm font-medium leading-relaxed transition-all duration-200 ${
                isUnread ? "text-gray-100" : "text-gray-200"
              }`}
            >
              {submission.quest_name}
            </p>

            {submission.review_comment && (
              <div className="mt-3 rounded-lg border border-gray-600/30 bg-gray-700/60 p-3 backdrop-blur-sm">
                <div className="mb-2 flex items-start gap-2 text-xs font-medium text-gray-200">
                  Review from {submission.reviewed_by}:
                </div>

                <p className="text-sm leading-relaxed text-gray-100">
                  {isExpanded
                    ? submission.review_comment
                    : truncateText(submission.review_comment)}
                </p>

                {hasLongComment && (
                  <button
                    onClick={() => onToggleExpanded(submission.submission_id)}
                    className="mt-2 text-sm font-medium text-blue-400 transition-colors duration-200 hover:text-blue-300 focus:outline-none"
                  >
                    {isExpanded ? "← Show Less" : "Show More →"}
                  </button>
                )}
              </div>
            )}

            {submission.rewards && submission.rewards.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-gray-200">Reward:</span>

                <span className="inline-flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/20 px-2 py-0.5 text-xs font-bold text-green-400">
                  +{submission.rewards[0].amount} points
                </span>
              </div>
            )}
          </div>
        </div>

        {submission.review_status === REVIEW_STATUS.HIGHLIGHTED && (
          <div className="absolute bottom-4 right-4">
            <StarIcon className="h-5 w-5 animate-pulse fill-yellow-400 text-yellow-400 drop-shadow-lg" />
          </div>
        )}
      </div>
    );
  },
);

InboxItem.displayName = "InboxItem";
export default InboxItem;
