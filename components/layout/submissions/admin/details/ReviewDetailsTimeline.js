import {
  UserIcon,
  FlagIcon,
  ClockIcon,
  XCircleIcon,
  CheckCircleIcon,
} from "lucide-react";
import React from "react";

const getTimeAgo = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  }
};

const getActivityIcon = (action) => {
  const iconMap = {
    flagged: <FlagIcon className="h-4 w-4 text-red-400" />,
    pending: <ClockIcon className="h-4 w-4 text-yellow-400" />,
    rejected: <XCircleIcon className="h-4 w-4 text-red-400" />,
    approved: <CheckCircleIcon className="h-4 w-4 text-green-400" />,
    highlighted: <CheckCircleIcon className="h-4 w-4 text-green-400" />,
  };

  return iconMap[action] || UserIcon;
};

const ReviewDetailsTimeline = ({ submission }) => {
  const reviewHistory = submission?.review_history || [];

  // Use enhanced data from SubmissionCardItem
  const ambassadorName =
    submission.ambassador_data?.username || "Unknown Ambassador";

  const questName = submission.quest_data?.name || "Unknown Quest";

  return (
    <div className="thin-scrollbar max-h-64 overflow-y-auto pr-4">
      <h3 className="mb-4 font-semibold text-white">Activity Timeline</h3>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-full bg-gray-500 p-1">
            <UserIcon size={16} className="text-white" />
          </div>

          <div className="flex flex-1 items-center gap-2">
            <span className="text-sm font-bold text-white">
              {ambassadorName}
            </span>

            <span className="text-sm text-gray-100">submitted</span>

            <span className="text-sm font-bold text-white">{questName}</span>

            <span className="text-xs text-gray-100">
              {getTimeAgo(submission.submitted_at)}
            </span>
          </div>

          <span className="rounded bg-gradient-primary px-2 py-0.5 text-xs font-medium text-gray-50">
            Submitted
          </span>
        </div>

        {reviewHistory.map((history, index) => {
          const ActivityIcon = getActivityIcon(history.status);

          return (
            <div key={index} className="flex items-start gap-3">
              <div className="flex items-center justify-center rounded-full px-1">
                {ActivityIcon}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">
                    {history.user_name || history.reviewed_by || "Admin"}
                  </span>

                  <span className="text-sm text-gray-100">
                    reviewed submission with{" "}
                  </span>

                  <span className="text-sm font-bold text-white">
                    {history.status || history.result}
                  </span>

                  <span className="text-xs text-gray-100">
                    {getTimeAgo(history.created_at || history.timestamp)}
                  </span>
                </div>

                {history.comment && (
                  <div className="mt-2 rounded bg-gray-500/50 p-2">
                    <p className="text-sm text-gray-100">"{history.comment}"</p>
                  </div>
                )}
              </div>

              <span
                className={`rounded px-2 py-0.5 text-xs font-medium ${
                  history.status === "approved"
                    ? "bg-green-500/20 text-green-400"
                    : history.status === "rejected"
                      ? "bg-red-500/20 text-red-400"
                      : history.status === "highlighted"
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {((history.status || history.result) === "approved"
                  ? "Success"
                  : (history.status || history.result) === "rejected"
                    ? "Failure"
                    : (history.status || history.result) === "highlighted"
                      ? "Highlighted"
                      : history.status || history.result
                )
                  .charAt(0)
                  .toUpperCase() +
                  ((history.status || history.result) === "approved"
                    ? "Success"
                    : (history.status || history.result) === "rejected"
                      ? "Failure"
                      : (history.status || history.result) === "highlighted"
                        ? "Highlighted"
                        : history.status || history.result
                  ).slice(1)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewDetailsTimeline;
