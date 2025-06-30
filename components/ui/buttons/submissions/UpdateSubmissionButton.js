// "use client";

// import React, { useState } from "react";
// import { SendIcon } from "lucide-react";
// import { useSelector } from "react-redux";

// import { selectIsQuestComplete } from "@/redux/slice/submissionSlice";

// const UpdateSubmissionButton = ({ submission }) => {
//   const [isLoading, setIsLoading] = useState(false);

//   const isQuestComplete = useSelector((state) =>
//     selectIsQuestComplete(state, submission.quest_id),
//   );

//   const handleUpdateQuest = async (e) => {
//     e.preventDefault();

//     if (!isQuestComplete || isLoading) return;

//     setIsLoading(true);

//     try {
//       // TODO: Implement update submission logic
//       console.log("Updating submission:", submission.submission_id);

//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 2000));

//       // This would be your API call to update the submission
//       // Similar to SubmitQuestBtn but for updating existing submission

//       // On success, redirect to submission view
//       // window.location.href = `/submissions/${submission.submission_id}`;
//     } catch (error) {
//       console.error("Error updating submission:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getButtonText = () => {
//     if (isLoading) return "Updating...";
//     if (!isQuestComplete) return "Complete Tasks";
//     return "Update";
//   };

//   return (
//     <button
//       type="submit"
//       onClick={handleUpdateQuest}
//       disabled={!isQuestComplete || isLoading}
//       className="flex items-center gap-2 text-nowrap rounded-full border border-white bg-gradient-primary px-2 py-1.5 text-xs capitalize hover:bg-black disabled:opacity-50"
//     >
//       <SendIcon size={16} />
//       {getButtonText()}
//     </button>
//   );
// };

// export default UpdateSubmissionButton;

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
  selectEditModeData,
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

  // FIXED: Use selectors safely with proper error handling
  const submissionError = useSelector(selectSubmissionError);
  const isQuestComplete = useSelector((state) => {
    try {
      return selectIsQuestComplete(state, questId);
    } catch (error) {
      console.warn("Error selecting quest complete:", error);
      return false;
    }
  });

  const submissionAnswers = useSelector((state) => {
    try {
      return selectSubmissionAnswers(state, questId);
    } catch (error) {
      console.warn("Error selecting submission answers:", error);
      return {};
    }
  });

  const editModeData = useSelector((state) => {
    try {
      return selectEditModeData(state, questId);
    } catch (error) {
      console.warn("Error selecting edit mode data:", error);
      return null;
    }
  });

  const originalAnswers = useSelector((state) => {
    try {
      return selectOriginalAnswers(state, questId);
    } catch (error) {
      console.warn("Error selecting original answers:", error);
      return {};
    }
  });

  // Helper function to upload files before update
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
          entityId: submission.ambassador_id,
          entityType: "SUBMISSIONS",
          customFolder: `submissions/${submission.ambassador_id}/${questId}`,
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
          entityId: submission.ambassador_id,
          entityType: "SUBMISSIONS",
          customFolder: `submissions/${submission.ambassador_id}/${questId}`,
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

  // FIXED: Check if there are actual changes with proper null checking
  const hasChanges = () => {
    if (!originalAnswers || Object.keys(originalAnswers).length === 0)
      return true;
    if (!submissionAnswers || Object.keys(submissionAnswers).length === 0)
      return false;
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
      // Step 1: Upload any new files first
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
            description: "Now updating your submission...",
            color: "success",
          });
        } catch (uploadError) {
          console.error("File upload failed:", uploadError);
          throw new Error(uploadError.message);
        }
      }

      // Step 2: Update submission with processed answers
      const updatePayload = {
        submission_data: processedAnswers,
        additional_context: submission.additional_context,
      };

      const updateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}/edit`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updatePayload),
        },
      );

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update submission");
      }

      const updateResult = await updateResponse.json();

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

          // Show appropriate message based on auto-review result
          if (
            autoReviewResult.data.auto_review_attempted &&
            autoReviewResult.data.auto_review_successful
          ) {
            if (autoReviewResult.data.approved) {
              addToast({
                title: "Submission Updated & Approved!",
                description:
                  "Your updated submission has been approved instantly!",
                color: "success",
              });
            } else {
              addToast({
                title: "Submission Updated",
                description:
                  "Some answers still need correction. Please check your inbox.",
                color: "warning",
              });
            }
          } else {
            // Auto-review failed or not applicable
            addToast({
              title: "Submission Updated",
              description:
                "Your submission has been updated and is being reviewed.",
              color: "success",
            });
          }
        } else {
          // Auto-review endpoint failed, but update was successful
          addToast({
            title: "Submission Updated",
            description:
              "Your submission has been updated and is being reviewed.",
            color: "success",
          });
        }
      } catch (autoReviewError) {
        // Auto-review failed but update succeeded
        addToast({
          title: "Submission Updated",
          description:
            "Your submission has been updated and is being reviewed.",
          color: "success",
        });
      }

      // Clear edit mode and redirect back to submission details
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

  const getButtonText = () => {
    if (isLoading) return "Updating...";
    if (!isQuestComplete) return "Complete Tasks";
    if (!hasChanges()) return "No Changes";
    return "Update";
  };

  const isDisabled = !isQuestComplete || isLoading || !hasChanges();

  return (
    <>
      <button
        type="submit"
        onClick={handleUpdateQuest}
        disabled={isDisabled}
        className={`flex items-center gap-2 text-nowrap rounded-full border border-white px-2 py-1.5 text-xs capitalize ${
          isDisabled
            ? "cursor-not-allowed bg-gray-400 opacity-50"
            : "cursor-pointer bg-gradient-primary hover:bg-black"
        }`}
      >
        <SendIcon size={16} />
        {getButtonText()}
      </button>
    </>
  );
};

export default UpdateSubmissionButton;
