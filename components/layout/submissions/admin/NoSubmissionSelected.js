import React from "react";
import { MessageSquareIcon, MousePointerClickIcon } from "lucide-react";
import WrapperContainer from "@/components/common/WrapperContainer";

const NoSubmissionSelected = ({ currentStatus, submissionCount }) => {
  const getStatusText = (status) => {
    const statusMap = {
      all: "all submissions",
      pending: "pending submissions",
      approved: "approved submissions",
      rejected: "rejected submissions",
      highlighted: "highlighted submissions",
      flagged: "flagged submissions",
    };

    return statusMap[status] || "submissions";
  };

  return (
    <WrapperContainer
      scrollable={false}
      className="flex h-full flex-[2] items-center justify-center overflow-y-auto p-8 scrollbar-hide"
    >
      <div className="max-w-md text-center text-gray-400">
        <div className="mx-auto mb-6 w-fit rounded-full border border-gray-400 bg-gradient-dark p-6">
          <MousePointerClickIcon className="h-12 w-12 text-gray-100" />
        </div>

        <h3 className="mb-2 text-lg font-bold text-white">
          No Submission Selected
        </h3>

        <p className="mb-4 text-gray-200">
          {submissionCount > 0
            ? `Click on any of the ${submissionCount} ${getStatusText(currentStatus)} to view details and start reviewing.`
            : `No ${getStatusText(currentStatus)} found. Try switching to a different status filter.`}
        </p>

        {submissionCount > 0 && (
          <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-400/50 bg-gray-700/30 p-4 text-sm text-gray-200">
            <MessageSquareIcon className="h-4 w-4" />

            <span>
              Select a submission to see tasks, history, and review options
            </span>
          </div>
        )}
      </div>
    </WrapperContainer>
  );
};

export default NoSubmissionSelected;
