import {
  EditIcon,
  StarIcon,
  LinkIcon,
  ClockIcon,
  UsersIcon,
  ImageIcon,
  FileUpIcon,
  XCircleIcon,
  FileTextIcon,
  ArrowLeftIcon,
  ArrowUp01Icon,
  LetterTextIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  SquareArrowOutUpRightIcon,
} from "lucide-react";
import React from "react";
import Link from "next/link";

import FormattedSubmissionAnswer from "./FormatSubmissionAnswer";

import WrapperContainer from "@/components/common/WrapperContainer";

import XIcon from "@/components/ui/socialIcons/XIcon";
import DiscordIcon from "@/components/ui/socialIcons/DiscordIcon";
import TelegramIcon from "@/components/ui/socialIcons/TelegramIcon";

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

const getTaskTypeLabel = (taskType) => {
  const labels = {
    x: "X (Twitter)",
    url: "URL",
    nft: "NFT",
    text: "Text",
    token: "Token",
    number: "Number",
    discord: "Discord",
    link: "Visit Link",
    telegram: "Telegram",
    invite: "Invite Friends",
    "file-upload": "File Upload",
  };
  return labels[taskType] || "Task";
};

// Enhanced status configuration
const getStatusConfig = (reviewStatus, reviewedBy) => {
  const configs = {
    pending: {
      icon: ClockIcon,
      label: "Pending Review",
      variant: "yellow",
      canEdit: true,
      description: "Your submission is currently being reviewed by our team.",
    },

    approved: {
      icon: CheckCircleIcon,
      label: "Approved",
      variant: "green",
      canEdit: false,
      description:
        "Your submission has been approved! Rewards will be distributed shortly.",
    },

    rejected: {
      icon: XCircleIcon,
      label: "Rejected",
      variant: "red",
      canEdit: false,
      description:
        "Your submission was rejected. Please check the feedback and consider resubmitting.",
    },

    highlighted: {
      icon: StarIcon,
      label: "Highlighted",
      variant: "purple",
      canEdit: false,
      description: "Your submission has been highlighted as exceptional work!",
    },
  };

  // Handle different auto-review cases
  if (reviewedBy === "auto-system") {
    if (reviewStatus === "rejected") {
      return {
        ...configs.rejected,
        label: "Auto-Review Failed",
        description:
          "Automated review detected issues. Check feedback and resubmit.",
      };
    } else if (reviewStatus === "approved") {
      return {
        ...configs.approved,
        label: "Auto-Approved",
        description:
          "Automated review completed successfully. Rewards will be distributed shortly.",
      };
    }
  }

  return configs[reviewStatus?.toLowerCase()] || configs.pending;
};

const StatusChip = ({ children, variant = "yellow" }) => {
  const variants = {
    yellow: "bg-yellow-500/20 text-yellow-300 ring-yellow-500/30",
    green: "bg-green-500/20 text-green-300 ring-green-500/30",
    red: "bg-red-500/20 text-red-300 ring-red-500/30",
    purple: "bg-purple-500/20 text-purple-300 ring-purple-500/30",
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

const TaskCard = ({ task, answer }) => {
  const taskLabel = getTaskTypeLabel(task.name);
  const IconComponent = getTaskTypeIcon(task.name);

  return (
    <div className="rounded-2xl border border-gray-400 bg-gradient-dark p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex items-center justify-center rounded-full bg-gray-600 p-2.5">
          <IconComponent size={16} className="h-5 w-5 text-white" />
        </div>

        <div>
          <h3 className="font-semibold text-white">{task.instruction}</h3>
          <p className="text-sm text-gray-300">{taskLabel}</p>
        </div>
      </div>

      {task.description && (
        <p className="mb-4 text-sm text-gray-200">{task.description}</p>
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-200">Your Answer:</p>
        <div className="rounded-xl border-l-4 border-yellow-500/60 bg-white/10 p-4">
          <FormattedSubmissionAnswer answer={answer} />
        </div>
      </div>
    </div>
  );
};

const SubmissionDetailMainHeader = ({ submission }) => {
  const completedTasks = Object.keys(submission.submission_data || {}).length;
  const totalTasks = submission.quest_tasks?.length || completedTasks;
  const statusConfig = getStatusConfig(
    submission.review_status,
    submission.reviewed_by,
  );
  const StatusIcon = statusConfig.icon;

  return (
    <section className="flex justify-between gap-2.5 rounded-xl border-t border-gray-400 bg-black/50 px-8 py-2.5 backdrop-blur-xs">
      <Link
        href="/submissions"
        className="inline-flex items-center gap-2 text-sm text-gray-200 transition-colors hover:text-white"
      >
        <ArrowLeftIcon size={16} />
        Back to Submissions
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <StatusChip variant={statusConfig.variant}>
          <StatusIcon size={12} />
          <span>{statusConfig.label}</span>
        </StatusChip>

        <StatusChip variant="gray">
          <FileTextIcon size={12} />
          <span>
            {completedTasks} of {totalTasks} tasks
          </span>
        </StatusChip>

        {submission.resubmission_count > 0 && (
          <StatusChip variant="gray">
            <AlertCircleIcon size={12} />
            <span>Resubmission #{submission.resubmission_count}</span>
          </StatusChip>
        )}

        {statusConfig.canEdit ? (
          <Link
            href={`/submissions/${submission.submission_id}/edit`}
            className="flex w-fit items-center gap-2 rounded border border-gray-400 bg-gradient-dark px-3 py-1 text-gray-50 transition-colors hover:border-gray-300 hover:text-white"
          >
            <EditIcon size={16} />
            Edit
          </Link>
        ) : (
          <div className="flex w-fit cursor-not-allowed items-center gap-2 rounded border border-gray-500 bg-gray-700/50 px-3 py-1 text-gray-400">
            <EditIcon size={16} />
            Edit
          </div>
        )}
      </div>
    </section>
  );
};

const SubmissionDetailMainHeading = ({ submission }) => {
  return (
    <div className="space-y-6 pb-6">
      <SubmissionDetailMainHeader submission={submission} />

      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">
          {submission.quest_name}
        </h1>

        <div className="mt-2 flex items-center gap-2 text-gray-200">
          <span className="rounded-md bg-gray-600 px-2 py-1 text-sm">
            {submission.category_name}
          </span>
        </div>
      </div>
    </div>
  );
};

const SubmissionDetailMain = ({ submission }) => {
  if (!submission || !submission.submission_data) {
    return (
      <div className="flex max-w-7xl flex-1 flex-col items-center justify-center">
        <div className="space-y-4 text-center">
          <AlertCircleIcon size={48} className="mx-auto text-gray-400" />

          <h2 className="text-xl font-semibold text-white">
            No submission data found
          </h2>

          <p className="text-gray-300">
            There seems to be an issue loading this submission.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-7xl flex-1 flex-col gap-2 overflow-hidden">
      <SubmissionDetailMainHeading submission={submission} />

      <WrapperContainer scrollable className="space-y-6 p-10">
        <div className="space-y-6 overflow-y-auto scrollbar-hide">
          <h2 className="text-xl font-bold text-white">Your Submissions</h2>

          <div className="space-y-4">
            {submission.quest_tasks?.length > 0 ? (
              submission.quest_tasks.map((task) => {
                const answer = submission.submission_data[task.id];
                return <TaskCard key={task.id} task={task} answer={answer} />;
              })
            ) : (
              <div className="py-8 text-center">
                <FileTextIcon
                  size={48}
                  className="mx-auto mb-4 text-gray-400"
                />

                <p className="text-gray-300">No tasks found for this quest.</p>
              </div>
            )}
          </div>
        </div>
      </WrapperContainer>
    </div>
  );
};

export default SubmissionDetailMain;
