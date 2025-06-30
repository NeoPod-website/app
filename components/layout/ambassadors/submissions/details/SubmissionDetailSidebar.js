import React from "react";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";

import SubmissionDetailSidebarCard from "./SubmissionDetailSidebarCard";

import WrapperContainer from "@/components/common/WrapperContainer";

const SubmissionDetailSidebarHeader = ({ submission }) => {
  return (
    <section className="flex justify-between gap-2.5 rounded-xl border-t border-gray-400 bg-black/50 px-8 py-2.5 backdrop-blur-xs">
      <h2 className="text-md text-white">Submission Info</h2>

      <Link
        href={`/quests/${submission.category_id}/${submission.quest_id}`}
        className="flex w-fit items-center gap-2 rounded border border-gray-400 bg-gradient-dark px-3 py-1 text-gray-50 hover:border-gray-300 hover:text-white"
      >
        <ExternalLinkIcon size={16} />
        View Quest
      </Link>
    </section>
  );
};

const SubmissionDetailSidebar = ({ submission }) => {
  const completedTasks = Object.keys(submission.submission_data).length;

  const totalTasks = submission.quest_tasks?.length || completedTasks;

  return (
    <div className="flex max-w-md flex-1 flex-col gap-2">
      <SubmissionDetailSidebarHeader submission={submission} />

      <div className="space-y-3 overflow-y-auto scrollbar-hide">
        <SubmissionDetailSidebarCard
          submission={submission}
          totalTasks={totalTasks}
          completedTasks={completedTasks}
        />

        <WrapperContainer className="space-y-6 px-10 py-6 scrollbar-hide">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-yellow-300">
              Review Process
            </h3>

            <div className="space-y-3 text-sm text-gray-200">
              <p>
                Your submission is currently being reviewed by our team. This
                process typically takes 24-48 hours.
              </p>

              <p>
                You can edit your submission until it has been approved or
                rejected. Any changes will reset the review timer.
              </p>

              <p>You'll receive a notification once the review is complete.</p>
            </div>
          </div>
        </WrapperContainer>
      </div>
    </div>
  );
};

export default SubmissionDetailSidebar;
