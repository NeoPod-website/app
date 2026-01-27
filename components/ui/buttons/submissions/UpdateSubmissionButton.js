"use client";

import React, { useState } from "react";
import { SendIcon } from "lucide-react";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";

import {
  clearEditMode,
  updateTaskAnswer,
  setSubmissionError,
  clearSubmissionError,
  selectIsQuestComplete,
  selectSubmissionError,
  selectOriginalAnswers,
  selectSubmissionAnswers,
} from "@/redux/slice/submissionSlice";

import useUpload from "@/hooks/useUpload";

const UpdateSubmissionButton = ({ submission }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { uploadFile, uploadMultipleFiles } = useUpload();

  const questId = submission.quest_id;
  const submissionId = submission.submission_id;

  const submissionError = useSelector(selectSubmissionError);
  const isQuestComplete = useSelector((state) =>
    selectIsQuestComplete(state, questId),
  );
  const submissionAnswers = useSelector((state) =>
    selectSubmissionAnswers(state, questId),
  );
  const originalAnswers = useSelector((state) =>
    selectOriginalAnswers(state, questId),
  );

  // Helper function to upload files before update
  const uploadFilesFromAnswers = async (answers) => {
    const updatedAnswers = { ...answers };
    const filesToUpload = [];

    for (const [taskId, answer] of Object.entries(answers)) {
      if (answer && answer.file && !answer.uploaded) {
        filesToUpload.push({ taskId, answer, file: answer.file });
      }
    }

    if (filesToUpload.length === 0) return updatedAnswers;

    try {
      if (filesToUpload.length === 1) {
        const { taskId, answer, file } = filesToUpload[0];
        const uploadResult = await uploadFile(file, {
          size: "MEDIUM",
          fileName: "file",
          entityId: submission.ambassador_id,
          entityType: "SUBMISSIONS",
          customFolder: `submissions/${submission.ambassador_id}/${questId}`,
          multiSize: false,
          noSubfolder: false,
        });

        updatedAnswers[taskId] = {
          ...answer,
          fileUrl: uploadResult.url,
          fileKey: uploadResult.key,
          uploaded: true,
          uploadedAt: new Date().toISOString(),
          file: undefined,
        };

        dispatch(
          updateTaskAnswer({ questId, taskId, answer: updatedAnswers[taskId] }),
        );
      } else {
        const files = filesToUpload.map((item) => item.file);
        const uploadResults = await uploadMultipleFiles(files, {
          size: "MEDIUM",
          entityId: submission.ambassador_id,
          entityType: "SUBMISSIONS",
          customFolder: `submissions/${submission.ambassador_id}/${questId}`,
          multiSizeMode: false,
        });

        filesToUpload.forEach((item, index) => {
          const { taskId, answer } = item;
          const uploadResult = uploadResults.files[index];

          updatedAnswers[taskId] = {
            ...answer,
            fileUrl: uploadResult.url,
            fileKey: uploadResult.key,
            uploaded: true,
            uploadedAt: new Date().toISOString(),
            file: undefined,
          };

          dispatch(
            updateTaskAnswer({
              questId,
              taskId,
              answer: updatedAnswers[taskId],
            }),
          );
        });
      }
      return updatedAnswers;
    } catch (uploadError) {
      throw new Error(`Failed to upload files: ${uploadError.message}`);
    }
  };

  const hasChanges = () => {
    if (!originalAnswers || Object.keys(originalAnswers).length === 0)
      return true;
    return (
      JSON.stringify(originalAnswers) !== JSON.stringify(submissionAnswers)
    );
  };

  const handleUpdateQuest = async (e) => {
    e.preventDefault();
    if (!isQuestComplete || isLoading) return;

    setIsLoading(true);
    dispatch(clearSubmissionError());

    try {
      // Step 1: Upload new files
      let processedAnswers = submissionAnswers;
      const hasFilesToUpload = Object.values(submissionAnswers).some(
        (answer) => answer && answer.file && !answer.uploaded,
      );

      if (hasFilesToUpload) {
        processedAnswers = await uploadFilesFromAnswers(submissionAnswers);
        addToast({
          title: "Files Uploaded Successfully!",
          description: "Updating your submission details...",
          color: "success",
        });
      }

      // Step 2: Update submission via PATCH
      // Backend now performs auto-review internally during this call
      const updateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}/edit`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            submission_data: processedAnswers,
            additional_context: submission.additional_context,
          }),
        },
      );

      const result = await updateResponse.json();

      if (!updateResponse.ok) {
        throw new Error(result.message || "Failed to update submission");
      }

      // Step 3: Parse internal auto-review status from the updated item
      const updatedStatus = result.data?.submission?.review_status;

      if (updatedStatus === "approved") {
        addToast({
          title: "Submission Approved! ✓",
          description: "Your changes were auto-approved instantly.",
          color: "success",
        });
      } else if (updatedStatus === "rejected") {
        addToast({
          title: "Revision Required",
          description:
            "Auto-review failed with these changes. Please check feedback.",
          color: "warning",
        });
      } else {
        addToast({
          title: "Update Successful",
          description: "Submission updated and is now pending review.",
          color: "success",
        });
      }

      // Step 4: Cleanup and Redirect
      dispatch(clearEditMode({ questId }));
      router.push(`/submissions/${submissionId}`);
      router.refresh();
    } catch (error) {
      dispatch(setSubmissionError(error.message));
      addToast({
        title: "Update Failed",
        description: error.message,
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = !isQuestComplete || isLoading || !hasChanges();

  return (
    <button
      type="submit"
      onClick={handleUpdateQuest}
      disabled={isDisabled}
      className={`flex items-center gap-2 text-nowrap rounded-full border border-white px-3 py-1.5 text-xs capitalize transition-all ${
        isDisabled
          ? "cursor-not-allowed bg-gray-400 opacity-50"
          : "cursor-pointer bg-gradient-primary hover:brightness-110"
      }`}
    >
      <SendIcon size={14} />
      {isLoading
        ? "Updating..."
        : !isQuestComplete
          ? "Complete Tasks"
          : !hasChanges()
            ? "No Changes"
            : "Update Submission"}
    </button>
  );
};

export default UpdateSubmissionButton;
