import React from "react";
import Link from "next/link";
import {
  ClockIcon,
  EditIcon,
  TwitterIcon,
  FileTextIcon,
  ImageIcon,
  LinkIcon,
  CalendarIcon,
} from "lucide-react";

// Utility function to get submission type icon
const getSubmissionTypeIcon = (type) => {
  const icons = {
    twitter: TwitterIcon,
    text: FileTextIcon,
    image: ImageIcon,
    link: LinkIcon,
    file: FileTextIcon,
  };
  return icons[type] || FileTextIcon;
};

// Utility function to format submission preview
const getSubmissionPreview = (submissionData) => {
  if (!submissionData) return "No content";

  const { type, content, url, file_url } = submissionData;

  switch (type) {
    case "twitter":
      if (submissionData.thread_count) {
        return `Twitter thread (${submissionData.thread_count} tweets): ${content?.substring(0, 80)}...`;
      }
      if (submissionData.space_duration) {
        return `Twitter Space (${submissionData.space_duration}): ${content?.substring(0, 80)}...`;
      }
      return content?.length > 80 ? content.substring(0, 80) + "..." : content;

    case "text":
      const wordCount = submissionData.word_count
        ? ` (${submissionData.word_count} words)`
        : "";
      return `${content?.substring(0, 80)}...${wordCount}`;

    case "image":
      const dimensions = submissionData.dimensions
        ? ` • ${submissionData.dimensions}`
        : "";
      const size = submissionData.file_size
        ? ` • ${submissionData.file_size}`
        : "";
      return `${content}${dimensions}${size}`;

    case "link":
      const duration = submissionData.duration
        ? ` (${submissionData.duration})`
        : "";
      const platform = submissionData.platform
        ? ` on ${submissionData.platform}`
        : "";
      return `${content?.substring(0, 60)}...${platform}${duration}`;

    case "file":
      const pages = submissionData.pages
        ? ` • ${submissionData.pages} pages`
        : "";
      const fileSize = submissionData.file_size
        ? ` • ${submissionData.file_size}`
        : "";
      return `${content?.substring(0, 60)}...${pages}${fileSize}`;

    default:
      return typeof content === "string"
        ? content.length > 80
          ? content.substring(0, 80) + "..."
          : content
        : "Content submitted";
  }
};

// Utility function to format time ago
const getTimeAgo = (timestamp) => {
  const now = new Date();
  const submittedDate = new Date(timestamp);
  const diffInMs = now.getTime() - submittedDate.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays === 1) {
    return "1 day ago";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return submittedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
};

const SubmissionChip = ({ icon, text, color = "gray" }) => {
  const colorClasses = {
    gray: "bg-gray-500/20 text-gray-300",
    blue: "bg-blue-500/20 text-blue-300",
    yellow: "bg-yellow-500/20 text-yellow-300",
  };

  return (
    <div
      className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${colorClasses[color]}`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
};

const SubmissionItem = ({
  id,
  questId,
  questName,
  submittedAt,
  submissionData,
  categoryName,
  podName,
  canEdit = true,
}) => {
  const submissionType = submissionData?.type || "text";
  const SubmissionIcon = getSubmissionTypeIcon(submissionType);
  const preview = getSubmissionPreview(submissionData);
  const timeAgo = getTimeAgo(submittedAt);

  return (
    <li>
      <div className="flex flex-col gap-4 rounded-2.5xl border-t border-gray-400 bg-gradient-dark/60 p-5 shadow shadow-white/10 transition-[colors,shadow] hover:border-gray-200 hover:bg-gradient-dark hover:shadow-white/30">
        {/* Header with status and edit button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SubmissionChip
              icon={<ClockIcon size={12} />}
              text="Pending Review"
              color="yellow"
            />
            <SubmissionChip
              icon={<SubmissionIcon size={12} />}
              text={
                submissionType.charAt(0).toUpperCase() + submissionType.slice(1)
              }
              color="blue"
            />
          </div>

          {canEdit && (
            <Link
              href={`/submissions/${id}/edit`}
              className="bg-blue-600/20 hover:bg-blue-600/30 flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-blue-400 transition-colors hover:text-blue-300"
            >
              <EditIcon size={12} />
              Edit
            </Link>
          )}
        </div>

        {/* Quest info */}
        <div className="space-y-2">
          <Link href={`/quests/${questId}`} className="group block">
            <h4 className="text-base font-bold text-white transition-colors group-hover:text-blue-300">
              {questName}
            </h4>
          </Link>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{categoryName}</span>
            {podName && (
              <>
                <span>•</span>
                <span>{podName}</span>
              </>
            )}
          </div>
        </div>

        {/* Submission preview */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-300">Preview:</p>
          <div className="rounded-lg border-l-2 border-blue-500/50 bg-gray-700/40 p-3">
            <p className="text-sm leading-relaxed text-gray-100">{preview}</p>

            {/* Show additional context if available */}
            {submissionData?.additional_context && (
              <div className="mt-2 border-t border-gray-600/50 pt-2">
                <p className="text-xs text-gray-400">
                  <span className="font-medium">Note:</span>{" "}
                  {submissionData.additional_context}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer with timestamp */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <CalendarIcon size={12} />
            <span>Submitted {timeAgo}</span>
          </div>

          <Link
            href={`/submissions/${id}`}
            className="text-blue-400 transition-colors hover:text-blue-300"
          >
            View Details →
          </Link>
        </div>
      </div>
    </li>
  );
};

export default SubmissionItem;
