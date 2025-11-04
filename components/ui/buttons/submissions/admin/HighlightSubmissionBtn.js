"use client";

import {
  ListIcon,
  StarIcon,
  UserIcon,
  PlusIcon,
  TrashIcon,
  CalendarIcon,
  ChevronLeftIcon,
  HighlighterIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "@heroui/react";
import { addToast } from "@heroui/react";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect, useCallback } from "react";

import MainModal from "@/components/ui/modals/MainModal";
import ReviewDetailsSubmissions from "@/components/layout/submissions/admin/details/ReviewDetailsSubmissions";

import {
  setCurrentQuest,
  setHighlightedSubmissionsData,
} from "@/redux/slice/questSlice";

import {
  useHighlightActions,
  createHighlightErrorHandler,
} from "@/utils/highlightActions";

const getTimeAgo = (timestamp) => {
  const now = new Date();
  const submittedDate = new Date(timestamp);
  const diffInMs = now.getTime() - submittedDate.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
};

const HighlightSubmissionBtn = ({
  submission,
  reviewComment,
  onReviewSubmission,
  isTransitioning = false,
}) => {
  const dispatch = useDispatch();
  const highlightManager = useHighlightActions();
  const handleError = createHighlightErrorHandler(addToast);

  // Get data from Redux
  const currentQuest = useSelector((state) => state.quest?.currentQuest);
  const questHighlights = useSelector(
    (state) => state.quest?.currentQuest?.highlighted_submissions || [],
  );
  const highlightedSubmissionsData = useSelector(
    (state) => state.quest?.highlightedSubmissionsData || [],
  );

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingHighlights, setUpdatingHighlights] = useState(false);
  const [fetchingSubmissions, setFetchingSubmissions] = useState(false);
  const [currentSubmissionIndex, setCurrentSubmissionIndex] = useState(0);

  // ✅ Fetch and update quest data in Redux when submission's quest changes
  useEffect(() => {
    const fetchQuestData = async () => {
      if (!submission?.quest_id) return;

      // Skip if already loaded for this quest
      if (currentQuest?.quest_id === submission.quest_id) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/quests/${submission.quest_id}`,
          { credentials: "include" },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch quest data");
        }

        const data = await response.json();
        const quest = data.data?.quest || data.quest || data;

        // ✅ Update Redux with the quest for this submission
        dispatch(setCurrentQuest(quest));
      } catch (error) {
        console.error("Error fetching quest data:", error);
      }
    };

    fetchQuestData();
  }, [submission?.quest_id, currentQuest?.quest_id, dispatch]);

  // ✅ Clear cached submissions when quest changes
  useEffect(() => {
    dispatch(setHighlightedSubmissionsData([]));
    setCurrentSubmissionIndex(0);
  }, [submission?.quest_id, dispatch]);

  // ✅ Reset loading state when submission changes
  useEffect(() => {
    setLoading(false);
  }, [submission?.submission_id]);

  const currentHighlightedSubmission =
    highlightedSubmissionsData[currentSubmissionIndex];

  const isCurrentSubmissionHighlighted = questHighlights.includes(
    submission?.submission_id,
  );

  // Fetch highlighted submissions when modal opens or when highlight IDs change
  useEffect(() => {
    if (isModalOpen && questHighlights.length > 0) {
      const missingSubmissions = questHighlights.filter(
        (id) =>
          !highlightedSubmissionsData.find((sub) => sub.submission_id === id),
      );

      if (
        missingSubmissions.length > 0 ||
        highlightedSubmissionsData.length === 0
      ) {
        fetchHighlightedSubmissions();
      }
    }
  }, [isModalOpen, questHighlights, highlightedSubmissionsData]);

  const fetchHighlightedSubmissions = useCallback(async () => {
    if (questHighlights.length === 0) return;

    setFetchingSubmissions(true);
    try {
      const submissionPromises = questHighlights.map(async (submissionId) => {
        const cachedSubmission = highlightedSubmissionsData.find(
          (sub) => sub.submission_id === submissionId,
        );

        if (cachedSubmission) return cachedSubmission;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}`,
          { credentials: "include" },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch submission ${submissionId}: ${response.status}`,
          );
        }

        const data = await response.json();
        return data.data?.submission || data.submission || data;
      });

      const submissions = await Promise.all(submissionPromises);
      console.log("Fetching highlighted submissions:", submissions);

      const enrichedSubmissions = await Promise.all(
        submissions.map(async (sub) => {
          if (sub.ambassador_data && sub.computed) return sub;

          try {
            const ambassadorResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/ambassadors/${sub.ambassador_id}`,
              { credentials: "include" },
            );

            let ambassador = null;
            if (ambassadorResponse.ok) {
              const ambassadorData = await ambassadorResponse.json();
              ambassador =
                ambassadorData?.data?.ambassador ||
                ambassadorData?.ambassador ||
                ambassadorData;
            }

            return {
              ...sub,
              ambassador_data: ambassador,
              quest_data: currentQuest,
              computed: {
                ambassador_name:
                  ambassador?.username ||
                  ambassador?.name ||
                  "Unknown Ambassador",
                quest_name: currentQuest?.name || "Unknown Quest",
                task_count: Object.keys(sub.submission_data || {}).length,
              },
            };
          } catch (error) {
            console.error(
              `Error enriching submission ${sub.submission_id}:`,
              error,
            );
            return {
              ...sub,
              quest_data: currentQuest,
              computed: {
                ambassador_name: "Unknown Ambassador",
                quest_name: currentQuest?.name || "Unknown Quest",
                task_count: Object.keys(sub.submission_data || {}).length,
              },
            };
          }
        }),
      );

      console.log("Enriched highlighted submissions:", enrichedSubmissions);
      dispatch(setHighlightedSubmissionsData(enrichedSubmissions));
    } catch (error) {
      handleError(error, "fetching highlighted submissions");
    } finally {
      setFetchingSubmissions(false);
    }
  }, [questHighlights, highlightedSubmissionsData, currentQuest, dispatch]);

  const handleHighlight = async () => {
    setLoading(true);
    try {
      // First, highlight the submission (change its status)
      await onReviewSubmission(
        "highlighted",
        reviewComment,
        currentQuest?.rewards,
      );

      // Then, add to highlights using the manager (only 2 params!)
      await highlightManager.addHighlight(submission.submission_id, true);

      addToast({
        title: "Submission highlighted successfully",
        color: "success",
      });

      // ✅ Success - parent will handle navigation to next submission
    } catch (error) {
      handleError(error, "highlighting submission");
      setLoading(false);
    }
  };

  // ✅ Change submission status from "highlighted" to "approved"
  const changeSubmissionStatusToApproved = async (
    submissionId,
    submissionData,
  ) => {
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
            review_status: "approved",
            review_comment: "Changed from highlighted to approved",
            rewards: submissionData?.rewards || currentQuest?.rewards || [],
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to change submission status: ${response.status}`,
        );
      }

      return true;
    } catch (error) {
      console.error("Error changing submission status to approved:", error);
      return false;
    }
  };

  // ✅ Remove highlight (for the submission being viewed in modal)
  const handleRemoveHighlight = async (submissionIdToRemove) => {
    setUpdatingHighlights(true);

    try {
      // Find the submission data for rewards
      const submissionToRemove = highlightedSubmissionsData.find(
        (sub) => sub.submission_id === submissionIdToRemove,
      );

      // Step 1: Remove from quest's highlights array using highlightManager (only 2 params!)
      await highlightManager.removeHighlight(submissionIdToRemove, true);

      // Step 2: Change submission status from "highlighted" to "approved"
      await changeSubmissionStatusToApproved(
        submissionIdToRemove,
        submissionToRemove,
      );

      // Step 3: Update local cache
      const updatedSubmissions = highlightedSubmissionsData.filter(
        (sub) => sub.submission_id !== submissionIdToRemove,
      );
      dispatch(setHighlightedSubmissionsData(updatedSubmissions));

      // Adjust current index if needed
      if (updatedSubmissions.length === 0) {
        setIsModalOpen(false);
      } else if (currentSubmissionIndex >= updatedSubmissions.length) {
        setCurrentSubmissionIndex(updatedSubmissions.length - 1);
      }

      addToast({
        title: "Highlight removed successfully",
        description: "Submission status changed to approved",
        color: "success",
      });
    } catch (error) {
      handleError(error, "removing highlight");
    } finally {
      setUpdatingHighlights(false);
    }
  };

  const handleAddCurrentSubmission = async () => {
    if (isCurrentSubmissionHighlighted || questHighlights.length >= 3) {
      return;
    }

    setUpdatingHighlights(true);

    try {
      // First, highlight the submission (change its status to highlighted)
      await onReviewSubmission(
        "highlighted",
        reviewComment,
        currentQuest?.rewards,
      );

      // Then, add to highlights array (only 2 params!)
      await highlightManager.addHighlight(submission.submission_id, true);

      addToast({
        title: "Submission added to highlights",
        color: "success",
      });
    } catch (error) {
      handleError(error, "adding submission to highlights");
    } finally {
      setUpdatingHighlights(false);
    }
  };

  const handleViewHighlighted = () => {
    setIsModalOpen(true);
    setCurrentSubmissionIndex(0);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSubmissionIndex(0);
  };

  const handlePrevious = () => {
    setCurrentSubmissionIndex((prev) =>
      prev > 0 ? prev - 1 : highlightedSubmissionsData.length - 1,
    );
  };

  const handleNext = () => {
    setCurrentSubmissionIndex((prev) =>
      prev < highlightedSubmissionsData.length - 1 ? prev + 1 : 0,
    );
  };

  const modalFooter = (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        {highlightedSubmissionsData.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              disabled={updatingHighlights}
              className="flex items-center gap-1 rounded-lg bg-gray-700 px-3 py-2 text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
            >
              <ChevronLeftIcon size={16} />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {highlightedSubmissionsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSubmissionIndex(index)}
                  disabled={updatingHighlights}
                  className={`h-8 w-8 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${
                    index === currentSubmissionIndex
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={updatingHighlights}
              className="flex items-center gap-1 rounded-lg bg-gray-700 px-3 py-2 text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
            >
              Next
              <ChevronRightIcon size={16} />
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {currentHighlightedSubmission && (
          <button
            onClick={() =>
              handleRemoveHighlight(currentHighlightedSubmission.submission_id)
            }
            disabled={updatingHighlights}
            className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            <TrashIcon size={16} />
            {updatingHighlights ? "Removing..." : "Remove Highlight"}
          </button>
        )}

        {!isCurrentSubmissionHighlighted && questHighlights.length < 3 && (
          <button
            onClick={handleAddCurrentSubmission}
            disabled={updatingHighlights}
            className="flex items-center gap-1 rounded-lg bg-yellow-600 px-3 py-2 text-white transition-colors hover:bg-yellow-700 disabled:opacity-50"
          >
            <PlusIcon size={16} />
            {updatingHighlights ? "Adding..." : "Add Current"}
          </button>
        )}

        <button
          onClick={handleCloseModal}
          disabled={updatingHighlights}
          className="rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
        >
          Close
        </button>
      </div>
    </div>
  );

  const renderButtons = () => {
    const showHighlightButton =
      submission.review_status === "pending" &&
      !isCurrentSubmissionHighlighted &&
      questHighlights.length < 3;

    const showViewButton = questHighlights.length > 0;

    if (!showHighlightButton && !showViewButton) {
      return null;
    }

    const isDisabled = loading || isTransitioning;

    return (
      <div className="flex items-center gap-2">
        {showHighlightButton && (
          <Button
            size="lg"
            radius="full"
            disabled={isDisabled}
            onPress={handleHighlight}
            endContent={<HighlighterIcon size={16} />}
            className={`neo-button border border-gray-400 ${
              !isDisabled
                ? "cursor-pointer bg-gradient-dark hover:bg-gray-700"
                : "cursor-not-allowed opacity-50"
            }`}
          >
            {loading
              ? "Highlighting..."
              : isTransitioning
                ? "Loading..."
                : "Highlight"}
          </Button>
        )}

        {showViewButton && (
          <Button
            size="lg"
            radius="full"
            variant="flat"
            onPress={handleViewHighlighted}
            startContent={<StarIcon size={16} />}
            className="neo-button border border-yellow-500/50 bg-yellow-500/20 text-yellow-100 hover:bg-yellow-500/30"
          >
            View Highlighted ({questHighlights.length})
          </Button>
        )}
      </div>
    );
  };

  return (
    <>
      {renderButtons()}

      <MainModal
        title="Highlighted Submissions"
        description={`Viewing highlighted submissions for "${currentQuest?.name || "this quest"}"`}
        isOpen={isModalOpen}
        handleOnClose={handleCloseModal}
        showFooter={true}
        footer={modalFooter}
        size="4xl"
      >
        {fetchingSubmissions ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-500"></div>
              <p className="text-gray-400">
                Loading highlighted submissions...
              </p>
            </div>
          </div>
        ) : highlightedSubmissionsData.length === 0 ? (
          <div className="py-12 text-center">
            <StarIcon className="mx-auto mb-4 h-12 w-12 text-gray-500 opacity-50" />
            <p className="text-gray-400">No highlighted submissions found</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-600 bg-gray-800 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                  <UserIcon size={20} className="text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {currentHighlightedSubmission?.computed?.ambassador_name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CalendarIcon size={14} />
                    <span>
                      Submitted{" "}
                      {getTimeAgo(currentHighlightedSubmission?.submitted_at)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-sm text-yellow-400">
                  <StarIcon size={14} />
                  Highlighted
                </div>
                <div className="flex items-center gap-1 rounded-full bg-gray-700 px-3 py-1 text-sm text-gray-300">
                  <ListIcon size={14} />
                  {currentHighlightedSubmission?.computed?.task_count} Tasks
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-600 bg-gray-800/50">
              {currentHighlightedSubmission && (
                <ReviewDetailsSubmissions
                  submission={currentHighlightedSubmission}
                />
              )}
            </div>

            {highlightedSubmissionsData.length > 1 && (
              <div className="text-center text-sm text-gray-400">
                Showing submission {currentSubmissionIndex + 1} of{" "}
                {highlightedSubmissionsData.length}
              </div>
            )}
          </div>
        )}
      </MainModal>
    </>
  );
};

export default HighlightSubmissionBtn;
