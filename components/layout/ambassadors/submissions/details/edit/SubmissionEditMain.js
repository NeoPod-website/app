import React from "react";
import Link from "next/link";
import { ArrowLeftIcon, ClockIcon, FileTextIcon, EditIcon } from "lucide-react";

import WrapperContainer from "@/components/common/WrapperContainer";
import QuestDetailsTask from "@/components/layout/quests/detail/QuestDetailTask";
import UpdateSubmissionButton from "@/components/ui/buttons/submissions/UpdateSubmissionButton";

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

const SubmissionEditMainHeader = ({ submission }) => {
  const completedTasks = Object.keys(submission.submission_data).length;
  const totalTasks = submission.quest?.tasks?.length || completedTasks;

  return (
    <section className="flex justify-between gap-2.5 rounded-xl border-t border-gray-400 bg-black/50 px-8 py-2.5 backdrop-blur-xs">
      <Link
        href={`/submissions/${submission.submission_id}`}
        className="inline-flex items-center gap-2 text-sm text-gray-200 transition-colors hover:text-white"
      >
        <ArrowLeftIcon size={16} />
        Back to Submission
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <StatusChip variant="yellow">
          <ClockIcon size={12} />
          <span>Editing</span>
        </StatusChip>

        <StatusChip variant="gray">
          <FileTextIcon size={12} />
          <span>{totalTasks} tasks</span>
        </StatusChip>

        <UpdateSubmissionButton submission={submission} />
      </div>
    </section>
  );
};

const SubmissionEditHeader = ({ submission }) => {
  return (
    <div className="space-y-6 pb-6">
      <SubmissionEditMainHeader submission={submission} />

      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">
          Edit: {submission.quest_name}
        </h1>

        <div className="mt-2 flex items-center gap-2 text-gray-200">
          <span className="rounded-md bg-gray-600 px-2 py-1 text-sm">
            {submission.category_name}
          </span>

          {submission.pod_name && (
            <>
              <span>•</span>
              <span className="rounded-md bg-gray-600 px-2 py-1 text-sm">
                {submission.pod_name}
              </span>
            </>
          )}
        </div>

        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
          <div className="flex items-start gap-3">
            <EditIcon size={16} className="mt-0.5 text-yellow-400" />

            <div className="space-y-1">
              <p className="text-sm font-medium text-yellow-300">
                Editing Your Submission
              </p>

              <p className="text-sm text-yellow-200">
                Modify your answers below and click "Update" to save your
                changes. Your submission will remain in pending status.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubmissionEditMain = ({ submission, user }) => {
  // Prepare quest object in the format expected by QuestDetailsTask
  const questForEdit = {
    quest_id: submission.quest_id,
    name: submission.quest_name,
    description: submission.quest?.description,
    tasks: submission.quest?.tasks || [],
  };

  return (
    <div className="flex max-w-7xl flex-1 flex-col gap-2 overflow-hidden">
      <SubmissionEditHeader submission={submission} />

      <WrapperContainer scrollable className="space-y-6 p-10">
        <div className="space-y-6 overflow-y-auto scrollbar-hide">
          <h2 className="text-xl font-bold text-white">Quest Tasks</h2>

          <div className="space-y-6">
            <QuestDetailsTask quest={questForEdit} user={user} />
          </div>
        </div>
      </WrapperContainer>
    </div>
  );
};

export default SubmissionEditMain;
