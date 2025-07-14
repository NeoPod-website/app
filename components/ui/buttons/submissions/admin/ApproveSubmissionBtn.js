"use client";

import { Button } from "@heroui/react";
import React, { useState } from "react";
import { SendHorizonalIcon } from "lucide-react";

const ApproveSubmissionBtn = ({
  submission,
  reviewComment = "",
  onReviewSubmission,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);

    try {
      // Comment is optional for approval
      await onReviewSubmission("approved", reviewComment, submission.rewards);
    } catch (error) {
      // Error handling is done in parent component
      console.error("Approve failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      size="lg"
      radius="full"
      onPress={handleApprove}
      disabled={isSubmitting}
      endContent={<SendHorizonalIcon size={16} />}
      className={`neo-button flex h-12 items-center gap-2 rounded-full border border-white ${
        !isSubmitting
          ? "cursor-pointer bg-gradient-primary hover:opacity-90"
          : "cursor-not-allowed bg-gray-400 opacity-50"
      }`}
    >
      {isSubmitting ? "Approving..." : "Approve"}
    </Button>
  );
};

export default ApproveSubmissionBtn;
