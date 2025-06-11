"use client";

import React from "react";
import { addToast, Button } from "@heroui/react";
import { SendHorizonalIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import {
  setSubmitting,
  updateTaskAnswer,
  addSubmittedQuest,
  setSubmissionError,
  selectIsSubmitting,
  clearAllSubmissions,
  clearSubmissionError,
  markQuestAsSubmitted,
  selectIsQuestComplete,
  selectSubmissionError,
  selectSubmissionAnswers,
} from "@/redux/slice/submissionSlice";

import useUpload from "@/hooks/useUpload";

const SubmitQuestBtn = ({ podId, categoryId, questId, ambassadorId }) => {
  const dispatch = useDispatch();
  const { uploadFile, uploadMultipleFiles } = useUpload();

  const isSubmitting = useSelector(selectIsSubmitting);
  const submissionError = useSelector(selectSubmissionError);

  const isQuestComplete = useSelector((state) =>
    selectIsQuestComplete(state, questId),
  );
  const submissionAnswers = useSelector((state) =>
    selectSubmissionAnswers(state, questId),
  );

  // Helper function to upload files before submission
  const uploadFilesFromAnswers = async (answers) => {
    const updatedAnswers = { ...answers };
    const filesToUpload = [];

    // Identify tasks with files that need uploading
    for (const [taskId, answer] of Object.entries(answers)) {
      if (answer && answer.file && !answer.uploaded) {
        filesToUpload.push({ taskId, answer, file: answer.file });
      }
    }

    if (filesToUpload.length === 0) {
      return updatedAnswers; // No files to upload
    }

    try {
      if (filesToUpload.length === 1) {
        // Single file upload
        const { taskId, answer, file } = filesToUpload[0];

        const uploadResult = await uploadFile(file, {
          size: "MEDIUM",
          fileName: "file",
          entityId: ambassadorId,
          entityType: "SUBMISSIONS",
          customFolder: `submissions/${ambassadorId}/${questId}`,
          multiSize: false,
          noSubfolder: false,
        });

        // Update the answer with upload result
        updatedAnswers[taskId] = {
          ...answer,
          fileUrl: uploadResult.url,
          fileKey: uploadResult.key,
          uploaded: true,
          uploadedAt: new Date().toISOString(),
          file: undefined,
        };

        // Update Redux state
        dispatch(
          updateTaskAnswer({
            questId,
            taskId,
            answer: updatedAnswers[taskId],
          }),
        );
      } else {
        // Multiple files upload
        const files = filesToUpload.map((item) => item.file);

        const uploadResults = await uploadMultipleFiles(files, {
          size: "MEDIUM",
          entityId: ambassadorId,
          entityType: "SUBMISSIONS",
          customFolder: `submissions/${ambassadorId}/${questId}`,
          multiSizeMode: false,
        });

        // Update answers with upload results
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

          // Update Redux state
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

  const handleSubmit = async () => {
    if (!isQuestComplete || isSubmitting) return;

    dispatch(setSubmitting(true));
    dispatch(clearSubmissionError());

    try {
      // Step 1: Upload any files first
      let processedAnswers = submissionAnswers;

      // Check if any answers contain files that need uploading
      const hasFilesToUpload = Object.values(submissionAnswers).some(
        (answer) => answer && answer.file && !answer.uploaded,
      );

      if (hasFilesToUpload) {
        try {
          processedAnswers = await uploadFilesFromAnswers(submissionAnswers);

          // Show success message for file uploads
          addToast({
            title: "Files Uploaded Successfully! ✓",
            description: "Now submitting your quest...",
            color: "success",
          });
        } catch (uploadError) {
          console.error("File upload failed:", uploadError);
          throw new Error(uploadError.message);
        }
      }

      // Step 2: Create submission with processed answers (including uploaded file URLs)
      const submissionPayload = {
        pod_id: podId,
        quest_id: questId,
        category_id: categoryId,
        submission_data: processedAnswers,
      };

      const createResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(submissionPayload),
        },
      );

      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit quest");
      }

      const createResult = await createResponse.json();
      const submissionId = createResult.data.submission_id;

      // Step 3: Attempt auto-review (silent, in background)
      try {
        const autoReviewResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}/attempt-auto-review`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({}),
          },
        );

        if (autoReviewResponse.ok) {
          const autoReviewResult = await autoReviewResponse.json();
          console.log("autoReviewResponse", autoReviewResult);

          // Update Redux with the final submission state
          dispatch(
            addSubmittedQuest({
              questId,
              submissionData: autoReviewResult,
            }),
          );

          // Show appropriate message based on auto-review result
          if (
            autoReviewResult.data.auto_review_attempted &&
            autoReviewResult.data.auto_review_successful
          ) {
            if (autoReviewResult.data.approved) {
              addToast({
                title: "Quest Completed!",
                description: "Your submission has been approved instantly!",
                color: "success",
              });
            } else {
              addToast({
                title: "Quest Needs Revision",
                description:
                  "Some answers need correction. Please check your inbox.",
                color: "warning",
              });
            }
          } else {
            // Auto-review failed or not applicable - normal pending message
            addToast({
              title: "Quest Submitted",
              description: "Your submission is being reviewed by our team.",
              color: "success",
            });
          }
        } else {
          // Auto-review endpoint failed, but submission was created successfully
          addToast({
            title: "Quest Submitted",
            description: "Your submission is being reviewed by our team.",
            color: "success",
          });
        }
      } catch (autoReviewError) {
        addToast({
          title: "Quest Submitted",
          description: "Your submission is being reviewed by our team.",
          color: "success",
        });
      }

      dispatch(clearAllSubmissions());
    } catch (error) {
      dispatch(setSubmissionError(error.message));

      addToast({
        title: "Submission Failed",
        description: error.message,
        color: "danger",
      });
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  return (
    <div className="submit-section">
      <Button
        size="lg"
        radius="full"
        onClick={(e) => {
          e.preventDefault();
          const form = e.target.closest("form");

          if (form && form.checkValidity()) {
            handleSubmit(e);
          } else {
            // Show validation messages
            form?.reportValidity();
          }
        }}
        disabled={!isQuestComplete || isSubmitting}
        className={`neo-button border border-white ${
          isQuestComplete && !isSubmitting
            ? "cursor-pointer bg-gradient-primary"
            : "cursor-not-allowed bg-gray-400 opacity-50"
        }`}
        endContent={<SendHorizonalIcon size={16} />}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>

      {submissionError && (
        <div className="mt-2 text-sm text-red-600">{submissionError}</div>
      )}

      {!isQuestComplete && !isSubmitting && (
        <div className="mt-2 text-sm text-gray-400">
          Complete all tasks to submit
        </div>
      )}
    </div>
  );
};

export default SubmitQuestBtn;
