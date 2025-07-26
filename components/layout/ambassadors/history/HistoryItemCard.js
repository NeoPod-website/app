import {
  StarIcon,
  ClockIcon,
  XCircleIcon,
  CalendarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "lucide-react";
import React from "react";
import Link from "next/link";

import HistoryItemCardReview from "./HistoryItemCardReview";

const getTimeAgo = (timestamp) => {
  const now = new Date();

  const submittedDate = new Date(timestamp);

  const diffInMs = now.getTime() - submittedDate.getTime();

  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  } else {
    const options = {
      month: "short",
      day: "numeric",
      year:
        submittedDate.getFullYear() !== now.getFullYear()
          ? "numeric"
          : undefined,
    };
    return submittedDate.toLocaleDateString("en-US", options);
  }
};

const getStatusConfig = (status) => {
  switch (status) {
    case "approved":
      return {
        icon: CheckCircleIcon,
        text: "Approved",
        chipClass: "bg-green-500/30 text-green-400 ring-green-500/40",
        borderClass: "border-green-500/30",
        bgClass: "bg-green-500/5",
      };

    case "rejected":
      return {
        icon: XCircleIcon,
        text: "Rejected",
        chipClass: "bg-red-500/30 text-red-400 ring-red-500/40",
        borderClass: "border-red-500/30",
        bgClass: "bg-red-500/5",
      };

    case "highlighted":
      return {
        icon: StarIcon,
        text: "Highlighted",
        chipClass: "bg-yellow-500/30 text-yellow-400 ring-yellow-500/40",
        borderClass: "border-yellow-500/30",
        bgClass: "bg-yellow-500/5",
      };

    default:
      return {
        icon: ClockIcon,
        text: "Pending",
        chipClass: "bg-gray-500/30 text-gray-400 ring-gray-500/40",
        borderClass: "border-gray-400",
        bgClass: "bg-gray-500/5",
      };
  }
};

const StatusChip = ({ status }) => {
  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${config.chipClass}`}
    >
      <IconComponent size={12} />
      <span>{config.text}</span>
    </div>
  );
};

const HistoryItemCard = ({ submission, maxCommentLength = 200 }) => {
  const statusConfig = getStatusConfig(submission.review_status);

  return (
    <div
      className={`group relative rounded-2xl border bg-gradient-dark p-4 shadow-lg shadow-black/20 transition-all duration-200 3xl:p-6 ${statusConfig.borderClass}`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-200">
            <CalendarIcon size={14} />
            <span>{getTimeAgo(submission.submitted_at)}</span>
          </div>

          <h3 className="text-base font-bold text-white transition-colors group-hover:text-gray-100 lg:text-lg">
            {submission.quest_name}
          </h3>
        </div>

        <StatusChip status={submission.review_status} />
      </div>

      <HistoryItemCardReview
        submission={submission}
        statusConfig={statusConfig}
        maxCommentLength={maxCommentLength}
      />

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-4 text-sm text-gray-300">
          {submission.resubmission_count > 0 && (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>

              <span>
                {submission.resubmission_count} resubmission
                {submission.resubmission_count !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          <span className="hidden font-mono text-xs xl:block">
            ID: {submission.submission_id}
          </span>
        </div>

        <Link
          href={`/submissions/${submission.submission_id}`}
          className="inline-flex items-center gap-2 text-nowrap rounded-lg bg-gray-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-700 group-hover:bg-gray-700 2xl:text-sm"
        >
          <span>View Details</span>
          <ArrowRightIcon size={14} />
        </Link>
      </div>
    </div>
  );
};

export default HistoryItemCard;
