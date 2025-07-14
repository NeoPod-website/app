import React from "react";
import { ClockIcon } from "lucide-react";

import SubmissionItem from "./SubmissionItem";

const NoSubmissionsAvailable = () => (
  <div className="flex min-h-40 flex-1 flex-col items-center justify-center gap-4 rounded-lg p-8 text-center">
    <div className="mb-4 rounded-full bg-gray-700/50 p-6">
      <ClockIcon className="h-12 w-12 text-gray-500" />
    </div>

    <div className="space-y-2">
      <p className="text-xl font-bold text-white">No pending submissions</p>
      <p className="text-base text-gray-200">
        All your submissions have been reviewed or you haven't submitted any
        quests yet
      </p>
    </div>
  </div>
);

const SubmissionList = ({
  compact = false,
  submissions = [],
  scrollable = false,
}) => {
  if (!Array.isArray(submissions) || submissions.length === 0) {
    return <NoSubmissionsAvailable />;
  }

  return (
    <div className="px-8 pb-8">
      <ul
        className={`grid grid-cols-1 gap-6 ${compact ? "" : "md:grid-cols-2 lg:grid-cols-3"} ${scrollable ? "hide-scroll overflow-auto" : ""}`}
      >
        {submissions.map((submission) => (
          <SubmissionItem
            key={submission.submission_id}
            id={submission.submission_id}
            questId={submission.quest_id}
            questName={submission.quest_name}
            submittedAt={submission.submitted_at}
            submissionData={submission.submission_data}
            categoryName={submission.category_name}
            podName={submission.pod_name}
            canEdit={true} // Since these are pending, they can be edited
          />
        ))}
      </ul>
    </div>
  );
};

export default SubmissionList;
