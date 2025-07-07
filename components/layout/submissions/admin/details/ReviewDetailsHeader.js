import {
  BanIcon,
  FlagIcon,
  StarIcon,
  UndoIcon,
  ClockIcon,
  XCircleIcon,
  CheckCircleIcon,
} from "lucide-react";
import React from "react";
import { Button } from "@heroui/react";

import WrapperContainer from "@/components/common/WrapperContainer";
import UndoSubmissionBtn from "@/components/ui/buttons/submissions/admin/UndoSubmissionBtn";

const getStatusBadge = (status) => {
  const configs = {
    pending: {
      text: "Pending Review",
      icon: ClockIcon,
      bg: "bg-yellow-500/20",
      text_color: "text-yellow-400",
      border: "border-yellow-500/30",
    },
    approved: {
      text: "Approved",
      icon: CheckCircleIcon,
      bg: "bg-green-500/20",
      text_color: "text-green-400",
      border: "border-green-500/30",
    },
    rejected: {
      text: "Rejected",
      icon: XCircleIcon,
      bg: "bg-red-500/20",
      text_color: "text-red-400",
      border: "border-red-500/30",
    },
    highlighted: {
      text: "Highlighted",
      icon: StarIcon,
      bg: "bg-purple-500/20",
      text_color: "text-purple-400",
      border: "border-purple-500/30",
    },
  };

  return configs[status] || configs.pending;
};

const ReviewDetailsHeader = ({ submission, onSubmissionUpdate }) => {
  const statusConfig = getStatusBadge(submission.review_status);
  const StatusIcon = statusConfig.icon;

  return (
    <WrapperContainer className="flex flex-none items-center justify-between px-6 py-3">
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${statusConfig.bg} ${statusConfig.text_color} ${statusConfig.border}`}
        >
          <StatusIcon className="h-4 w-4" />
          {statusConfig.text}
        </span>

        {submission.is_flagged === "true" && (
          <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/20 px-3 py-1 text-sm font-medium text-red-400">
            <FlagIcon className="h-4 w-4" />
            Flagged
          </span>
        )}

        {submission.resubmission_count > 0 && (
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/20 px-3 py-1 text-sm font-medium text-orange-400">
            {submission.resubmission_count} Resubmission
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <>
          <Button
            size="sm"
            className="flex items-center gap-1 rounded-lg border border-red-500/50 bg-gradient-dark !px-3 !py-1 text-sm text-white transition-colors hover:bg-gray-600"
          >
            <BanIcon className="h-4 w-4" />
            Ban
          </Button>

          {submission.review_status !== "pending" && (
            <UndoSubmissionBtn
              submission={submission}
              onSubmissionUpdate={onSubmissionUpdate}
            />
          )}
        </>
      </div>
    </WrapperContainer>
  );
};

export default ReviewDetailsHeader;
