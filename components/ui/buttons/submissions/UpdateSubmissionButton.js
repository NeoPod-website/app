"use client";

import React, { useState } from "react";
import { SendIcon } from "lucide-react";
import { useSelector } from "react-redux";

import { selectIsQuestComplete } from "@/redux/slice/submissionSlice";

const UpdateSubmissionButton = ({ submission }) => {
  const [isLoading, setIsLoading] = useState(false);

  const isQuestComplete = useSelector((state) =>
    selectIsQuestComplete(state, submission.quest_id),
  );

  const handleUpdateQuest = async (e) => {
    e.preventDefault();

    if (!isQuestComplete || isLoading) return;

    setIsLoading(true);

    try {
      // TODO: Implement update submission logic
      console.log("Updating submission:", submission.submission_id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // This would be your API call to update the submission
      // Similar to SubmitQuestBtn but for updating existing submission

      // On success, redirect to submission view
      // window.location.href = `/submissions/${submission.submission_id}`;
    } catch (error) {
      console.error("Error updating submission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return "Updating...";
    if (!isQuestComplete) return "Complete Tasks";
    return "Update";
  };

  return (
    <button
      type="submit"
      onClick={handleUpdateQuest}
      disabled={!isQuestComplete || isLoading}
      className="flex items-center gap-2 text-nowrap rounded-full border border-white bg-gradient-primary px-2 py-1.5 text-xs capitalize hover:bg-black disabled:opacity-50"
    >
      <SendIcon size={16} />
      {getButtonText()}
    </button>
  );
};

export default UpdateSubmissionButton;
