"use client";

import { useState } from "react";
import { FlagIcon } from "lucide-react";
import { addToast, Button } from "@heroui/react";

import MainModal from "@/components/ui/modals/MainModal";

const FlagSubmissionBtn = ({
  submission,
  onSubmissionUpdate,
  disabled = false,
}) => {
  // Early return if no submission
  if (!submission) {
    return null;
  }

  const [flagReason, setFlagReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if submission is currently flagged
  const isFlagged =
    submission.is_flagged === "true" || submission.review_status === "flagged";

  const handleFlagClick = () => {
    if (isFlagged) {
      // If already flagged, unflag directly without modal
      handleUnflag();
    } else {
      // If not flagged, open modal for flag reason
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFlagReason("");
  };

  const handleConfirmFlag = async () => {
    if (!flagReason.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submission?.submission_id}/flag`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            review_status: "flagged",
            review_comment: flagReason.trim(),
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to flag submission");
      }

      const data = await response.json();

      // Update state using the callback
      if (onSubmissionUpdate && data.data?.submission) {
        onSubmissionUpdate(data.data.submission);
      }

      // Show success notification
      addToast({
        title: "Submission flagged successfully",
        description: "The submission has been marked as flagged.",
        color: "success",
      });

      handleCloseModal();
    } catch (error) {
      console.error("Error flagging submission:", error);

      // Show error notification
      addToast({
        title: "Something went wrong",
        description: "Failed to flag submission. Please try again.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnflag = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submission?.submission_id}/unflag`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            review_status: "pending",
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to unflag submission");
      }

      const data = await response.json();

      // Update state using the callback
      if (onSubmissionUpdate && data.data?.submission) {
        onSubmissionUpdate(data.data.submission);
      }

      // Show success notification
      addToast({
        title: "Submission unflagged successfully",
        description: "The submission has been changed back to pending.",
        color: "success",
      });
    } catch (error) {
      console.error("Error unflagging submission:", error);

      // Show error notification
      addToast({
        title: "Something went wrong",
        description: "Failed to unflag submission. Please try again.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const modalFooter = (
    <>
      <Button
        disabled={isLoading}
        onPress={handleCloseModal}
        className="rounded-lg px-4 py-2 text-sm text-gray-50 transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Cancel
      </Button>

      <Button
        onPress={handleConfirmFlag}
        disabled={!flagReason.trim() || isLoading}
        startContent={isLoading ? null : <FlagIcon size={16} />}
        className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Flagging..." : "Flag Submission"}
      </Button>
    </>
  );

  return (
    <>
      <Button
        onPress={handleFlagClick}
        disabled={disabled || isLoading}
        startContent={<FlagIcon size={16} />}
        className={`flex h-8 items-center gap-1 rounded-lg border !px-3 !py-1 text-sm transition-colors ${
          isFlagged
            ? "border-orange-500/50 bg-orange-500/20 text-orange-100 hover:bg-orange-600"
            : "border-red-500/50 bg-red-500/20 text-red-100 hover:bg-gray-600"
        } ${
          !disabled && !isLoading
            ? "cursor-pointer"
            : "cursor-not-allowed opacity-50"
        }`}
      >
        {isLoading
          ? isFlagged
            ? "Unflagging..."
            : "Flagging..."
          : isFlagged
            ? "Unflag"
            : "Flag"}
      </Button>

      <MainModal
        size="lg"
        showFooter={true}
        isOpen={isModalOpen}
        footer={modalFooter}
        title="Flag Submission"
        handleOnClose={handleCloseModal}
        description="Please provide a reason for flagging this submission. This action will change the review status to flagged."
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Reason for flagging *
            </label>

            <textarea
              rows={4}
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="Enter the reason for flagging this submission..."
              className="w-full resize-none rounded-lg border border-gray-400 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
              disabled={isLoading}
            />

            <p className="mt-1 text-xs text-gray-300">
              Provide specific details about policy violations or concerns
            </p>
          </div>

          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
            <p className="text-sm text-yellow-200">
              <strong>Note:</strong> This action will change the review status
              to "flagged" and notify the Ambassador.
            </p>
          </div>
        </div>
      </MainModal>
    </>
  );
};

export default FlagSubmissionBtn;
