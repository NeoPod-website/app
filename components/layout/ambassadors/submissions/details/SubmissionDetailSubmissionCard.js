import React from "react";
import { ClockIcon, CalendarIcon, FileTextIcon } from "lucide-react";

import WrapperContainer from "@/components/common/WrapperContainer";

const SubmissionDetailSubmissionCard = ({
  InfoItem,
  submission,
  totalTasks,
  submissionTime,
  completedTasks,
}) => {
  return (
    <WrapperContainer className="space-y-6 px-10 py-6 scrollbar-hide">
      <h3 className="mb-4 text-lg font-bold text-white">Details</h3>

      <div className="space-y-4">
        <InfoItem label="Submission ID">
          <span className="font-mono text-sm">{submission.submission_id}</span>
        </InfoItem>

        <InfoItem label="Submitted On" icon={CalendarIcon}>
          {submissionTime}
        </InfoItem>

        <InfoItem label="Status" icon={ClockIcon}>
          <span
            className={
              submission.review_status === "approved"
                ? "text-green-300"
                : submission.review_status === "rejected"
                  ? "text-red-300"
                  : submission.review_status === "highlighted"
                    ? "text-purple-300"
                    : "text-yellow-300"
            }
          >
            {submission.review_status === "approved"
              ? submission.reviewed_by === "auto-system"
                ? "Auto-Approved"
                : "Approved"
              : submission.review_status === "rejected"
                ? submission.reviewed_by === "auto-system"
                  ? "Auto-Review Failed"
                  : "Rejected"
                : submission.review_status === "highlighted"
                  ? "Highlighted"
                  : "Pending Review"}
          </span>
        </InfoItem>

        <InfoItem label="Progress" icon={FileTextIcon}>
          {completedTasks} of {totalTasks} tasks completed
        </InfoItem>
      </div>
    </WrapperContainer>
  );
};

export default SubmissionDetailSubmissionCard;
