"use client";

import React, { useState } from "react";
import { addToast, Button } from "@heroui/react";
import { XCircleIcon } from "lucide-react";

const RejectSubmissionBtn = ({
  submission,
  reviewComment = "",
  onReviewSubmission,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReject = async () => {
    // Validate comment is required for rejection
    if (!reviewComment?.trim()) {
      addToast({
        color: "warning",
        title: "Comment is required for rejection",
      });

      return;
    }

    setIsSubmitting(true);

    try {
      await onReviewSubmission("rejected", reviewComment, submission.rewards);
    } catch (error) {
      // Error handling is done in parent component
      console.error("Reject failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      size="lg"
      radius="full"
      onPress={handleReject}
      disabled={isSubmitting}
      className={`neo-button border border-red-400 bg-red-500/20 text-white ${
        !isSubmitting
          ? "cursor-pointer hover:bg-red-500/30"
          : "cursor-not-allowed opacity-50"
      }`}
      endContent={<XCircleIcon size={16} color="red" />}
    >
      {isSubmitting ? "Rejecting..." : "Reject"}
    </Button>
  );
};

export default RejectSubmissionBtn;
