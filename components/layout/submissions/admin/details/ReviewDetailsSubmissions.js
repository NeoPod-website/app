import {
  Coins,
  ListIcon,
  LinkIcon,
  ImageIcon,
  UsersIcon,
  FileUpIcon,
  FileTextIcon,
  ArrowUp01Icon,
  LetterTextIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ExternalLinkIcon,
} from "lucide-react";
import React from "react";

import XIcon from "@/components/ui/socialIcons/XIcon";
import DiscordIcon from "@/components/ui/socialIcons/DiscordIcon";
import TelegramIcon from "@/components/ui/socialIcons/TelegramIcon";

import FormattedSubmissionAnswer from "../../details/FormatSubmissionAnswer";

// Task type configuration
const getTaskConfig = (taskType, subType = null) => {
  const configs = {
    x: {
      icon: XIcon,
      label: "X (Twitter)",
      color: "text-black",
      bgColor: "bg-white/80",
    },
    url: {
      icon: LinkIcon,
      label: "URL",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    discord: {
      icon: DiscordIcon,
      label: "Discord",
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/20",
    },
    telegram: {
      icon: TelegramIcon,
      label: "Telegram",
      color: "text-blue-400",
      bgColor: "bg-white/10",
    },
    text: {
      icon: LetterTextIcon,
      label: "Text Response",
      color: "text-gray-400",
      bgColor: "bg-gray-500/20",
    },
    number: {
      icon: ArrowUp01Icon,
      label: "Number",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20",
    },
    "file-upload": {
      icon: FileUpIcon,
      label: "File Upload",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    link: {
      icon: ExternalLinkIcon,
      label: "Visit Link",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    invite: {
      icon: UsersIcon,
      label: "Invite Friends",
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
    },
    nft: {
      icon: ImageIcon,
      label: "NFT Verification",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
    token: {
      icon: Coins,
      label: "Token Verification",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
    },
  };

  // Handle X subtypes
  if (taskType === "x") {
    switch (subType) {
      case "spaces":
        return { ...configs.x, label: "X Spaces" };
      case "follow":
        return { ...configs.x, label: "X Follow" };
      case "react":
        return { ...configs.x, label: "X Tweet Engagement" };
      case "tweet":
        return { ...configs.x, label: "X Tweet" };
      default:
        return configs.x;
    }
  }

  return (
    configs[taskType] || {
      icon: FileTextIcon,
      label: "Task",
      color: "text-gray-400",
      bgColor: "bg-gray-500/20",
    }
  );
};

// Status badge component
const StatusBadge = ({ verified, className = "" }) => {
  if (verified) {
    return (
      <div
        className={`flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400 ${className}`}
      >
        <CheckCircleIcon size={12} />
        Verified
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-400 ${className}`}
    >
      <AlertCircleIcon size={12} />
      Pending
    </div>
  );
};

// Enhanced task answer renderer
const TaskAnswerRenderer = ({ task, answer, taskId }) => {
  const taskConfig = getTaskConfig(task?.name, task?.twitterTaskType);
  const IconComponent = taskConfig.icon;

  // Render verification status
  const renderVerificationStatus = () => {
    // For boolean answers (nft, token, invite, link)
    if (typeof answer === "boolean") {
      return <StatusBadge verified={answer} className="ml-auto" />;
    }

    // For object answers with verified field
    if (typeof answer === "object" && answer?.verified !== undefined) {
      return <StatusBadge verified={answer.verified} className="ml-auto" />;
    }

    return null;
  };

  return (
    <div className="rounded-lg border border-gray-600 bg-gradient-dark p-4 transition-colors hover:border-gray-500">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center rounded-lg p-2.5 ${taskConfig.bgColor}`}
          >
            <IconComponent
              size={18}
              className={`h-4 w-4 ${taskConfig.color}`}
            />
          </div>

          <div>
            <h4 className="font-medium text-white">
              {task?.instruction || taskConfig.label}
            </h4>
            <p className="text-sm text-gray-400">
              {taskConfig.label} • #{taskId.slice(-8)}
            </p>
          </div>
        </div>

        {renderVerificationStatus()}
      </div>

      {task?.description && (
        <p className="mb-3 pl-12 text-sm text-gray-300">{task.description}</p>
      )}

      <div className="pl-12">
        <div className="rounded-lg border-l-2 border-gray-600 bg-gray-700/50 p-3">
          <FormattedSubmissionAnswer
            task={task}
            answer={answer}
            taskType={task?.name}
            taskSubType={task?.twitterTaskType}
          />
        </div>
      </div>
    </div>
  );
};

// Updated ReviewDetailsSubmissions component
const ReviewDetailsSubmissions = ({ submission }) => {
  const taskCount =
    submission.computed?.task_count ||
    Object.keys(submission.submission_data || {}).length;
  const submissionTasks = Object.entries(submission.submission_data || {});

  // Get quest tasks from the quest_data
  const questTasks = submission.quest_data?.tasks || [];
  const getTaskById = (taskId) => {
    return questTasks.find((task) => task.id === taskId);
  };

  return (
    <div className="rounded-xl bg-gradient-dark p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListIcon className="h-5 w-5 text-gray-200" />

          <h3 className="font-semibold text-white">
            Submission Tasks ({taskCount})
          </h3>
        </div>

        <StatusBadge verified={submission.review_status !== "pending"} />
      </div>

      <div className="space-y-4">
        {submissionTasks.map(([taskId, taskData]) => {
          const questTask = getTaskById(taskId);

          return (
            <TaskAnswerRenderer
              key={taskId}
              task={questTask}
              answer={taskData}
              taskId={taskId}
            />
          );
        })}

        {submissionTasks.length === 0 && (
          <div className="py-8 text-center text-gray-400">
            <AlertCircleIcon className="mx-auto mb-2 h-12 w-12 opacity-50" />
            <p>No submission data found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDetailsSubmissions;
