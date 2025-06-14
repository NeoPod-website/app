import React from "react";
import Link from "next/link";
import { XIcon, AlertTriangleIcon } from "lucide-react";

import WrapperContainer from "@/components/common/WrapperContainer";
import SubmissionDetailSidebarCard from "../SubmissionDetailSidebarCard";

const SubmissionEditSidebarHeader = ({ submission }) => {
  return (
    <section className="flex justify-between gap-2.5 rounded-xl border-t border-gray-400 bg-black/50 px-8 py-2.5 backdrop-blur-xs">
      <h2 className="text-md text-white">Edit Controls</h2>

      <Link
        href={`/submissions/${submission.submission_id}`}
        className="flex w-fit items-center gap-2 rounded border border-gray-400 bg-gradient-dark px-3 py-1 text-gray-50 hover:border-gray-300 hover:text-white"
      >
        <XIcon size={16} />
        Cancel
      </Link>
    </section>
  );
};

const SubmissionEditSidebar = ({ submission }) => {
  const totalTasks = submission.quest?.tasks?.length || 0;
  const completedTasks = Object.keys(submission.submission_data).length;

  return (
    <div className="flex max-w-md flex-1 flex-col gap-2">
      <SubmissionEditSidebarHeader submission={submission} />

      <div className="space-y-3 overflow-y-auto scrollbar-hide">
        <SubmissionDetailSidebarCard
          submission={submission}
          totalTasks={totalTasks}
          completedTasks={completedTasks}
        />

        <WrapperContainer className="space-y-4 px-10 py-6 scrollbar-hide">
          <h3 className="text-lg font-bold text-yellow-300">Important</h3>

          <div className="space-y-3 text-sm text-gray-100">
            <div className="flex items-start gap-2">
              <AlertTriangleIcon
                size={16}
                className="mt-0.5 flex-shrink-0 text-yellow-400"
              />
              <p>
                Updating your submission will reset the review process. Your
                submission will remain in pending status.
              </p>
            </div>

            <p>
              You can edit your submission multiple times until it has been
              approved or rejected.
            </p>

            <p>Click "Update Submission" in the header to save your changes.</p>
          </div>
        </WrapperContainer>
      </div>
    </div>
  );
};

export default SubmissionEditSidebar;
