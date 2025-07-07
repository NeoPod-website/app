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
}) => {
  // Shared review submission handler
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

      // Update the submission in parent state
      if (onSubmissionUpdate && data.data?.submission) {
        onSubmissionUpdate(data.data.submission);
      }

      // Clear review comment after successful submission
      setReviewComment("");

      // Show success notification
      addToast({
        title: `Submission ${reviewStatus} successfully`,
        color: "success",
      });

      return data;
    } catch (error) {
      console.error("Error reviewing submission:", error);

      // Show error notification
      addToast({
        title: `Something went wrong`,
        description: "Failed to review submission. Please try again. ",
        color: "danger",
      });

      throw error;
    }
  };

  return (
    submission.review_status === "pending" && (
      <div className="flex items-center justify-between">
        <RejectSubmissionBtn
          submission={submission}
          reviewComment={reviewComment}
          onReviewSubmission={handleReviewSubmission}
        />

        <div className="flex items-center gap-2">
          <HighlightSubmissionBtn submission={submission} />

          <ApproveSubmissionBtn
            submission={submission}
            reviewComment={reviewComment}
            onReviewSubmission={handleReviewSubmission}
          />
        </div>
      </div>
    )
  );
};

export default ReviewDetailsBtn;
