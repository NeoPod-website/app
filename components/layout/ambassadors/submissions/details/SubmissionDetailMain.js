import {
  EditIcon,
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
  SquareArrowOutUpRightIcon,
} from "lucide-react";
import React from "react";
import Link from "next/link";

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
    invite: "Invite Friends",
    token: "Token",
    discord: "Discord",
    text: "Text",
    number: "Number",
    telegram: "Telegram",
    "file-upload": "File Upload",
    link: "Visit Link",
  };
  return labels[taskType] || "Task";
};

const formatSubmissionAnswer = (answer, taskType) => {
  if (answer === null || answer === undefined) {
    return "No answer provided";
  }

  if (typeof answer === "string") {
    if (answer.startsWith("http")) {
      return (
        <Link
          href={answer}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-white underline hover:text-gray-100"
        >
          {answer}
        </Link>
      );
    }
    return answer;
  }

  if (typeof answer === "number") {
    return answer.toString();
  }

  if (typeof answer === "boolean") {
    return (
      <div className="flex items-center gap-2">
        {answer ? (
          <>
            <CheckCircleIcon size={16} className="text-green-400" />
            <span className="text-green-400">Completed</span>
          </>
        ) : (
          <>
            <XCircleIcon size={16} className="text-red-400" />
            <span className="text-red-400">Not completed</span>
          </>
        )}
      </div>
    );
  }

  if (typeof answer === "object" && answer !== null) {
    // Handle file uploads
    if (answer.fileName && answer.fileUrl) {
      const sizeInMB = answer.fileSize
        ? (answer.fileSize / (1024 * 1024)).toFixed(2)
        : "Unknown";
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileUpIcon size={16} className="text-gray-200" />

            <span className="font-medium">{answer.fileName}</span>
            <span className="text-sm text-gray-300">({sizeInMB}MB)</span>
          </div>

          {answer.fileUrl && (
            <Link
              href={answer.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-white underline hover:text-gray-100"
            >
              View File →
            </Link>
          )}
        </div>
      );
    }

    // Handle social task objects
    if (answer.joined !== undefined || answer.verified !== undefined) {
      return (
        <div className="flex items-center gap-2">
          {answer.verified ? (
            <>
              <CheckCircleIcon size={16} className="text-green-400" />
              <span className="text-green-400">Verified</span>
            </>
          ) : answer.joined ? (
            <>
              <CheckCircleIcon size={16} className="text-yellow-400" />
              <span className="text-yellow-400">Joined</span>
            </>
          ) : (
            <>
              <ClockIcon size={16} className="text-gray-400" />
              <span className="text-gray-400">Pending</span>
            </>
          )}
        </div>
      );
    }

    return "Data submitted";
  }

  return "Submitted";
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

const TaskCard = ({ task, answer }) => {
  const taskLabel = getTaskTypeLabel(task.name);
  const IconComponent = getTaskTypeIcon(task.name);
  const formattedAnswer = formatSubmissionAnswer(answer, task.name);

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
          <div className="text-gray-100">{formattedAnswer}</div>
        </div>
      </div>
    </div>
  );
};

const SubmissionDetailMainHeader = ({ submission }) => {
  const completedTasks = Object.keys(submission.submission_data).length;
  const totalTasks = submission.quest_tasks?.length || completedTasks;

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
        <StatusChip variant="yellow">
          <ClockIcon size={12} />
          <span>Pending Review</span>
        </StatusChip>

        <StatusChip variant="gray">
          <FileTextIcon size={12} />
          <span>
            {completedTasks} of {totalTasks} tasks
          </span>
        </StatusChip>

        <Link
          href={`/submissions/${submission.submission_id}/edit`}
          className="flex w-fit items-center gap-2 rounded border border-gray-400 bg-gradient-dark px-3 py-1 text-gray-50 hover:border-gray-300 hover:text-white"
        >
          <EditIcon size={16} />
          Edit
        </Link>
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
  return (
    <div className="flex max-w-7xl flex-1 flex-col gap-2 overflow-hidden">
      <SubmissionDetailMainHeading submission={submission} />

      <WrapperContainer scrollable className="space-y-6 p-10">
        <div className="space-y-6 overflow-y-auto scrollbar-hide">
          <h2 className="text-xl font-bold text-white">Your Submissions</h2>

          <div className="space-y-4">
            {submission.quest_tasks?.map((task) => {
              const answer = submission.submission_data[task.id];
              return <TaskCard key={task.id} task={task} answer={answer} />;
            })}
          </div>
        </div>
      </WrapperContainer>
    </div>
  );
};

export default SubmissionDetailMain;
