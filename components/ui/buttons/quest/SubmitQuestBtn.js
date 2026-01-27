"use client";

import React from "react";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
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
  selectIsQuestComplete,
  selectSubmissionError,
  selectSubmissionAnswers,
} from "@/redux/slice/submissionSlice";

import useUpload from "@/hooks/useUpload";

const SubmitQuestBtn = ({ podId, categoryId, questId, ambassadorId }) => {
  const router = useRouter();
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
          size: "SUBMISSION",
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
          size: "SUBMISSION",
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

      const hasFilesToUpload = Object.values(submissionAnswers).some(
        (answer) => answer && answer.file && !answer.uploaded,
      );

      if (hasFilesToUpload) {
        try {
          processedAnswers = await uploadFilesFromAnswers(submissionAnswers);
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

      // Step 2: Create submission
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
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(submissionPayload),
        },
      );

      const createResult = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error(createResult.message || "Failed to submit quest");
      }

      // Step 3: Map the response correctly based on your JSON structure
      // Based on your response: createResult.data contains { submission_id, review_status }
      const responseData = createResult?.data;
      const status = responseData?.review_status;

      console.log("Submission Result:", createResult);

      // Update Redux with the final submission state
      dispatch(
        addSubmittedQuest({
          questId,
          submissionData: createResult,
        }),
      );

      // Step 4: UI Feedback based on auto-review status
      if (status === "approved") {
        addToast({
          title: "Quest Completed! ✓",
          description: "Your submission has been approved instantly!",
          color: "success",
        });
      } else if (status === "rejected") {
        addToast({
          title: "Auto-Review Failed",
          description:
            "Some answers were incorrect. Please check and resubmit.",
          color: "warning",
        });
      } else {
        addToast({
          title: "Quest Submitted",
          description: "Your submission is now pending manual review.",
          color: "success",
        });
      }

      // Step 5: Clean up
      dispatch(clearAllSubmissions());
      router.refresh();
    } catch (error) {
      // This catches both Network errors and "Cannot read property of undefined"
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
    <div className="submit-section flex min-w-48 flex-col items-end">
      <button
        onClick={(e) => {
          e.preventDefault();
          const form = e.target.closest("form");

          if (form && form.checkValidity()) {
            handleSubmit(e);
          } else {
            form?.reportValidity();
          }
        }}
        disabled={!isQuestComplete || isSubmitting}
        className={`neo-button flex h-12 items-center gap-2 rounded-full border border-white ${
          isQuestComplete && !isSubmitting
            ? "cursor-pointer bg-gradient-primary"
            : "cursor-not-allowed bg-gray-400 opacity-50"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Submit"}{" "}
        <SendHorizonalIcon size={16} />
      </button>

      {submissionError && (
        <div className="absolute -bottom-[22px] right-0 mt-2 hidden text-sm text-red-600 sm:block">
          {submissionError}
        </div>
      )}

      {!isQuestComplete && !isSubmitting && (
        <div className="absolute -bottom-[22px] right-0 mt-2 hidden text-sm text-gray-400 sm:block">
          Complete all tasks to submit
        </div>
      )}
    </div>
  );
};

export default SubmitQuestBtn;
