import {
  EditIcon,
  LinkIcon,
  ImageIcon,
  ClockIcon,
  UsersIcon,
  FileUpIcon,
  FileTextIcon,
  CalendarIcon,
  ArrowUp01Icon,
  LetterTextIcon,
  SquareArrowOutUpRightIcon,
} from "lucide-react";
import React from "react";
import Link from "next/link";

import XIcon from "@/components/ui/socialIcons/XIcon";
import DiscordIcon from "@/components/ui/socialIcons/DiscordIcon";
import TelegramIcon from "@/components/ui/socialIcons/TelegramIcon";

// Task type icons mapping
const getTaskTypeIcon = (taskType) => {
  const icons = {
    x: XIcon,
    url: LinkIcon,
    nft: ImageIcon,
    invite: UsersIcon,
    token: FileTextIcon,
    discord: DiscordIcon,
    text: LetterTextIcon,
    number: ArrowUp01Icon,
    telegram: TelegramIcon,
    "file-upload": FileUpIcon,
    link: SquareArrowOutUpRightIcon,
  };

  return icons[taskType] || FileTextIcon;
};

// Generate submission preview based on actual submission data structure
const generateSubmissionPreview = (submissionData, questTasks = []) => {
  if (!submissionData || typeof submissionData !== "object") {
    return {
      summary: "No submission data",
      details: [],
      taskCount: 0,
      completedCount: 0,
    };
  }

  const taskIds = Object.keys(submissionData);
  const completedCount = taskIds.length;
  const details = [];

  // Process each task submission
  taskIds.forEach((taskId, index) => {
    const answer = submissionData[taskId];
    let preview = "";
    let taskType = "text";

    // Try to determine task type from quest data if available
    const taskInfo = questTasks.find((t) => t.id === taskId);
    if (taskInfo) {
      taskType = taskInfo.name || taskInfo.type || "text";
    }

    // Generate preview based on answer type and structure
    if (answer === null || answer === undefined) {
      preview = "No answer provided";
    } else if (typeof answer === "string") {
      if (answer.startsWith("http")) {
        taskType = taskType === "text" ? "url" : taskType;
        preview = answer.length > 50 ? `${answer.substring(0, 50)}...` : answer;
      } else {
        preview = answer.length > 60 ? `${answer.substring(0, 60)}...` : answer;
      }
    } else if (typeof answer === "number") {
      taskType = taskType === "text" ? "number" : taskType;
      preview = answer.toString();
    } else if (typeof answer === "boolean") {
      preview = answer ? "Completed" : "Not completed";
    } else if (typeof answer === "object" && answer !== null) {
      // Handle file uploads
      if (answer.fileName && answer.fileUrl) {
        taskType = "file-upload";
        const sizeInMB = answer.fileSize
          ? (answer.fileSize / (1024 * 1024)).toFixed(2)
          : "Unknown";
        preview = `${answer.fileName} (${sizeInMB}MB)`;
      }
      // Handle social task objects
      else if (answer.joined !== undefined || answer.verified !== undefined) {
        preview = answer.verified
          ? "Verified"
          : answer.joined
            ? "Joined"
            : "Pending";
      }
      // Handle other object structures
      else {
        preview = "Data submitted";
      }
    } else {
      preview = "Submitted";
    }

    details.push({
      taskId,
      taskType,
      preview: preview || "Submitted",
      index: index + 1,
    });
  });

  // Generate summary
  let summary = "";
  if (completedCount === 0) {
    summary = "No tasks completed";
  } else if (completedCount === 1) {
    summary = `1 task completed: ${details[0]?.preview || "Task submitted"}`;
  } else {
    const taskTypes = [...new Set(details.map((d) => d.taskType))];
    if (taskTypes.length === 1) {
      summary = `${completedCount} ${taskTypes[0]} tasks completed`;
    } else {
      summary = `${completedCount} tasks completed (${taskTypes.slice(0, 2).join(", ")}${taskTypes.length > 2 ? "..." : ""})`;
    }
  }

  return {
    summary,
    details: details.slice(0, 3),
    taskCount: questTasks.length || completedCount,
    completedCount,
  };
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

const StatusChip = ({ children, variant = "yellow" }) => {
  const variants = {
    yellow: "bg-yellow-500/20 text-yellow-300 ring-yellow-500/30",
    gray: "bg-gray-600 text-gray-200 ring-gray-400",
  };

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${variants[variant]}`}
    >
      {children}
    </div>
  );
};

const SubmissionCard = ({ submission }) => {
  const {
    submission_id,
    pod_id,
    quest_id,
    pod_name,
    quest_name,
    category_id,
    quest_tasks,
    submitted_at,
    category_name,
    submission_data,
  } = submission;

  const preview = generateSubmissionPreview(submission_data, quest_tasks);
  const timeAgo = getTimeAgo(submitted_at);

  return (
    <div className="group relative flex flex-col rounded-2xl border border-gray-400 bg-gradient-dark p-6 shadow-lg shadow-black/20 transition-all duration-200 hover:border-gray-300 hover:shadow-xl hover:shadow-black/30">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip variant="yellow">
            <ClockIcon size={12} />
            <span>Pending Review</span>
          </StatusChip>

          <StatusChip variant="gray">
            <FileTextIcon size={12} />
            <span>
              {preview.completedCount} task
              {preview.completedCount !== 1 ? "s" : ""}
            </span>
          </StatusChip>
        </div>

        <Link
          href={`/submissions/${submission_id}/edit`}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors hover:text-gray-100"
        >
          <EditIcon size={12} />
          Edit
        </Link>
      </div>

      <div className="mb-4 space-y-3">
        <Link
          href={`/quests/${pod_id}/${category_id}/${quest_id}`}
          className="group/link block"
        >
          <h3 className="text-lg font-bold text-white transition-colors group-hover/link:text-gray-100">
            {quest_name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-sm text-gray-200">
          <span className="rounded-md bg-gray-600 px-2 py-1">
            {category_name}
          </span>

          {pod_name && (
            <>
              <span>•</span>
              <span className="rounded-md bg-gray-600 px-2 py-1">
                {pod_name}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="mb-4 flex flex-1 flex-col space-y-3">
        <p className="text-sm font-medium text-gray-200">Submission Preview:</p>

        <div className="flex-1 rounded-xl border-l-4 border-yellow-500/60 bg-white/10 p-4">
          <p className="mb-2 text-sm font-medium text-gray-100">
            {preview.summary}
          </p>

          {preview.details.length > 0 && (
            <div className="space-y-2">
              {preview.details.map((detail) => {
                const IconComponent = getTaskTypeIcon(detail.taskType);

                return (
                  <div
                    key={detail.taskId}
                    className="flex items-start gap-1.5 text-xs text-gray-200"
                  >
                    <IconComponent
                      size={12}
                      className="h-4 w-4 text-gray-200"
                    />
                    <span className="capitalize">{detail.taskType}:</span>
                    <span className="text-gray-100">{detail.preview}</span>
                  </div>
                );
              })}

              {preview.completedCount > 3 && (
                <div className="text-xs text-gray-300">
                  ... and {preview.completedCount - 3} more task
                  {preview.completedCount - 3 !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-200">
        <div className="flex items-center gap-1.5">
          <CalendarIcon size={12} />
          <span>Submitted {timeAgo}</span>
        </div>

        <Link
          href={`/submissions/${submission_id}`}
          className="font-medium text-white transition-colors hover:text-gray-100"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default SubmissionCard;
