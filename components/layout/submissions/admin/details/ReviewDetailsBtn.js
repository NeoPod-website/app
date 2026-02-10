import React from "react";
import { addToast } from "@heroui/react";

import RejectSubmissionBtn from "@/components/ui/buttons/submissions/admin/RejectSubmissionBtn";
import ApproveSubmissionBtn from "@/components/ui/buttons/submissions/admin/ApproveSubmissionBtn";
import HighlightSubmissionBtn from "@/components/ui/buttons/submissions/admin/HighlightSubmissionBtn";

const ReviewDetailsBtn = ({
  submission,
  reviewComment,
  setReviewComment,
  onSubmissionUpdate,
  isTransitioning = false,
}) => {
  const handleReviewSubmission = async (
    reviewStatus,
    comment = null,
    rewards = null,
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submission.submission_id}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            review_status: reviewStatus,
            review_comment: comment,
            rewards: rewards,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to review submission");
      }

      const data = await response.json();

      if (onSubmissionUpdate && data.data?.submission) {
        onSubmissionUpdate(data.data.submission);
      }

      return data;
    } catch (error) {
      console.error("Error reviewing submission:", error);

      // Show error notification
      addToast({
        title: `Something went wrong`,
        description: "Failed to review submission. Please try again.",
        color: "danger",
      });

      throw error;
    }
  };

  const shouldShowButtons = submission.review_status === "pending";

  if (!shouldShowButtons) {
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      <RejectSubmissionBtn
        submission={submission}
        reviewComment={reviewComment}
        onReviewSubmission={handleReviewSubmission}
        isTransitioning={isTransitioning}
      />

      <div className="flex items-center gap-2">
        <HighlightSubmissionBtn
          submission={submission}
          reviewComment={reviewComment}
          onReviewSubmission={handleReviewSubmission}
          isTransitioning={isTransitioning}
        />

        <ApproveSubmissionBtn
          submission={submission}
          reviewComment={reviewComment}
          onReviewSubmission={handleReviewSubmission}
          isTransitioning={isTransitioning}
        />
      </div>
    </div>
  );
};

export default ReviewDetailsBtn;
