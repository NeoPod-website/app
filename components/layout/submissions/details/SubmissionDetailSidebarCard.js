import React from "react";

import SubmissionDetailQuestCard from "./SubmissionDetailQuestCard";
import SubmissionDetailSubmissionCard from "./SubmissionDetailSubmissionCard";

const formatSubmissionTime = (timestamp) => {
  const date = new Date(timestamp);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const InfoItem = ({ label, children, icon: Icon }) => {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-200">{label}</p>

      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className="text-gray-300" />}
        <div className="text-gray-50">{children}</div>
      </div>
    </div>
  );
};

const SubmissionDetailSidebarCard = ({
  submission,
  totalTasks,
  completedTasks,
}) => {
  const submissionTime = formatSubmissionTime(submission.submitted_at);

  return (
    <div className="flex flex-col gap-3 md:flex-row lg:flex-col">
      <SubmissionDetailSubmissionCard
        InfoItem={InfoItem}
        submission={submission}
        totalTasks={totalTasks}
        submissionTime={submissionTime}
        completedTasks={completedTasks}
      />

      <SubmissionDetailQuestCard InfoItem={InfoItem} submission={submission} />
    </div>
  );
};

export default SubmissionDetailSidebarCard;
