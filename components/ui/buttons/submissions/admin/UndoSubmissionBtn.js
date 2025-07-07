"use client";

import { Button } from "@heroui/react";
import React, { useState } from "react";
import { UndoIcon } from "lucide-react";
import { addToast } from "@heroui/react";

const UndoSubmissionBtn = ({ submission, onSubmissionUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUndoToPending = async () => {
    setIsLoading(true);

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
            review_status: "pending",
            review_comment: `Reverted from ${submission.review_status} to pending`,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to revert submission");
      }

      const data = await response.json();

      // Update state using the callback
      if (onSubmissionUpdate && data.data?.submission) {
        onSubmissionUpdate(data.data.submission);
      }

      // Show success notification
      addToast({
        title: "Submission reverted to pending",
        color: "success",
      });
    } catch (error) {
      console.error("Error reverting submission:", error);

      // Show error notification
      addToast({
        title: "Something went wrong",
        description: "Failed to revert submission. Please try again.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Only show for non-pending submissions
  if (submission.review_status === "pending") {
    return null;
  }

  return (
    <Button
      onPress={handleUndoToPending}
      size="sm"
      disabled={isLoading}
      className={`flex items-center gap-1 rounded-lg border border-gray-500 bg-gradient-dark !px-3 !py-1 text-sm text-white transition-colors ${
        !isLoading
          ? "cursor-pointer hover:bg-gray-600"
          : "cursor-not-allowed opacity-50"
      }`}
    >
      <UndoIcon className="h-4 w-4" />
      {isLoading ? "Undoing..." : "Undo"}
    </Button>
  );
};

export default UndoSubmissionBtn;
