"use client";

import { Button } from "@heroui/react";
import React, { useState } from "react";
import { UndoIcon } from "lucide-react";
import { addToast } from "@heroui/react";
import { useSelector } from "react-redux";

import {
  useHighlightActions,
  createHighlightErrorHandler,
} from "@/utils/highlightActions";

const UndoSubmissionBtn = ({ submission, onSubmissionUpdate }) => {
  const highlightManager = useHighlightActions();
  const handleError = createHighlightErrorHandler(addToast);

  const questHighlights = useSelector(
    (state) => state.quest?.currentQuest?.highlighted_submissions || [],
  );

  const [isLoading, setIsLoading] = useState(false);

  const revertSubmissionStatus = async (submissionId, fromStatus) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            review_status: "pending",
            review_comment: `Reverted from ${fromStatus} to pending`,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to revert submission: ${response.status} - ${errorText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error reverting submission status:", error);
      throw error;
    }
  };

  const handleUndoToPending = async () => {
    // Prevent double-clicks and concurrent operations
    if (isLoading) return;

    setIsLoading(true);

    const isHighlighted = questHighlights.includes(submission.submission_id);
    const fromStatus = submission.review_status;

    console.log(
      `Starting undo operation for submission ${submission.submission_id} from ${fromStatus}, highlighted: ${isHighlighted}`,
    );

    try {
      // STEP 1: Revert submission status (most critical operation)
      const submissionData = await revertSubmissionStatus(
        submission.submission_id,
        fromStatus,
      );

      console.log(
        `Successfully reverted submission ${submission.submission_id} to pending`,
      );

      // Update submission state immediately after successful status change
      if (onSubmissionUpdate && submissionData.data?.submission) {
        onSubmissionUpdate(submissionData.data.submission);
      }

      // STEP 2: Handle highlight removal if necessary
      if (isHighlighted) {
        try {
          console.log(
            `Removing submission ${submission.submission_id} from highlights`,
          );

          // Use the bulletproof highlight manager with optimistic updates
          await highlightManager.removeHighlight(
            submission.submission_id,
            true,
          );

          console.log(
            `Successfully removed submission ${submission.submission_id} from highlights`,
          );
        } catch (highlightError) {
          console.error(
            "Failed to update highlights, but submission status was reverted:",
            highlightError,
          );

          // Show partial success - submission was reverted but highlight removal failed
          addToast({
            title: "Submission reverted but highlight removal failed",
            description:
              "Please refresh the page or try removing the highlight manually",
            color: "warning",
          });

          // Don't throw error - submission revert was successful
          return;
        }
      }

      // STEP 3: Success notification
      // const message = isHighlighted
      //   ? "Submission reverted to pending and removed from highlights"
      //   : "Submission reverted to pending";

      // addToast({
      //   title: message,
      //   color: "success",
      // });
    } catch (error) {
      console.error("Critical error in undo operation:", error);
      handleError(error, "undoing submission");
    } finally {
      setIsLoading(false);
    }
  };

  // Only show for non-pending submissions
  if (submission.review_status === "pending") {
    return null;
  }

  // Determine button appearance and text
  const buttonText = isLoading ? "Undoing..." : "Undo";
  const isHighlighted = questHighlights.includes(submission.submission_id);

  const buttonClasses = `
    flex items-center gap-1 rounded-lg border transition-colors
    !px-3 !py-1 text-sm text-white
    ${
      !isLoading
        ? "cursor-pointer hover:bg-gray-600"
        : "cursor-not-allowed opacity-50"
    }
    ${
      isHighlighted
        ? "border-yellow-500/50 bg-yellow-500/10 hover:bg-yellow-500/20"
        : "border-gray-500 bg-gradient-dark"
    }
  `
    .trim()
    .replace(/\s+/g, " ");

  const tooltipText = isHighlighted
    ? "This will revert the submission to pending and remove it from quest highlights"
    : `Revert submission from ${submission.review_status} to pending status`;

  return (
    <Button
      onPress={handleUndoToPending}
      size="sm"
      disabled={isLoading}
      className={buttonClasses}
      title={tooltipText}
    >
      <UndoIcon className="h-4 w-4" />
      {buttonText}
    </Button>
  );
};

export default UndoSubmissionBtn;
