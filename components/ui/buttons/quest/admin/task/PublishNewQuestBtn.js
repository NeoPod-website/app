"use client";

import { SendIcon } from "lucide-react";
import { Button, addToast } from "@heroui/react";
import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { resetCurrentQuest } from "@/redux/slice/questSlice";

const PublishNewQuestBtn = ({ podId, categoryId }) => {
  const dispatch = useDispatch();
  const currentQuest = useSelector((state) => state.quest.currentQuest);

  const [isLoading, setIsLoading] = useState(false);

  const createQuestWithStatus = useCallback(
    async (e) => {
      e.preventDefault();

      if (isLoading) return;

      // Validate required fields
      if (!currentQuest.name?.trim()) {
        addToast({
          title: "Validation Error",
          description: "Quest name is required",
          color: "danger",
        });
        return;
      }

      if (!currentQuest.description?.trim()) {
        addToast({
          title: "Validation Error",
          description: "Quest description is required",
          color: "danger",
        });
        return;
      }

      if (!currentQuest.tasks || currentQuest.tasks.length === 0) {
        addToast({
          title: "Validation Error",
          description: "At least one task is required",
          color: "danger",
        });
        return;
      }

      if (!currentQuest.rewards || currentQuest.rewards.length === 0) {
        addToast({
          title: "Validation Error",
          description: "At least one reward is required",
          color: "danger",
        });
        return;
      }

      if (!podId && !currentQuest.podId) {
        addToast({
          title: "Validation Error",
          description: "Pod ID is required",
          color: "danger",
        });
        return;
      }

      if (!categoryId && !currentQuest.categoryId) {
        addToast({
          title: "Validation Error",
          description: "Category ID is required",
          color: "danger",
        });
        return;
      }

      setIsLoading(true);

      try {
        // Map frontend status to backend status
        const statusMapping = {
          publish: "active",
          draft: "draft",
          archive: "archive",
        };

        // Get the selected status from Redux state
        const selectedStatus = currentQuest.status || "publish";

        const questData = {
          // Required fields
          name: currentQuest.name.trim(),
          description: currentQuest.description.trim(),
          tasks: currentQuest.tasks,
          rewards: currentQuest.rewards,
          pod_id: podId || currentQuest.podId,
          category_id: categoryId || currentQuest.categoryId,
          status: statusMapping[selectedStatus] || selectedStatus,
        };

        // Optional fields - only add if they have meaningful values
        if (currentQuest.conditions && currentQuest.conditions.length > 0) {
          questData.conditions = currentQuest.conditions;
        }

        if (
          currentQuest.highlighted_submissions &&
          currentQuest.highlighted_submissions.length > 0
        ) {
          questData.highlighted_submissions =
            currentQuest.highlighted_submissions;
        }

        if (
          typeof currentQuest.display_order === "number" &&
          currentQuest.display_order >= 0
        ) {
          questData.display_order = currentQuest.display_order;
        }

        if (currentQuest.due_date && currentQuest.due_date.trim()) {
          questData.due_date = currentQuest.due_date;
        }

        // Only send recurrence if it's not the default "never"
        if (currentQuest.recurrence && currentQuest.recurrence !== "never") {
          questData.recurrence = currentQuest.recurrence;
        }

        // Only send cooldown if it's different from default
        if (currentQuest.cooldown && currentQuest.cooldown !== "1h") {
          questData.cooldown = currentQuest.cooldown;
        }

        if (typeof currentQuest.limit === "number" && currentQuest.limit > 0) {
          questData.limit = currentQuest.limit;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/quests`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(questData),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error: ${response.status}`);
        }

        // Reset the current quest after successful creation
        dispatch(resetCurrentQuest());

        // Success messages based on status
        const statusMessages = {
          publish: "published and is now live",
          draft: "saved as draft",
          archive: "created and archived",
        };

        addToast({
          title: "Quest Created Successfully",
          description: `Quest "${questData.name}" has been ${statusMessages[selectedStatus]}`,
          color: "success",
        });
      } catch (error) {
        console.error("Error creating quest:", error);

        addToast({
          title: "Failed to Create Quest",
          description:
            error.message || "Please check your input and try again.",
          color: "danger",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [currentQuest, podId, categoryId, isLoading, dispatch],
  );

  // Get the button text based on selected status
  const getButtonText = () => {
    if (isLoading) return "Creating...";

    const status = currentQuest.status || "publish";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Button
      type="submit"
      disabled={isLoading}
      onClick={(e) => {
        e.preventDefault();
        const form = e.target.closest("form");

        if (form && form.checkValidity()) {
          createQuestWithStatus(e);
        } else {
          // Show validation messages
          form.reportValidity();
        }
      }}
      className="!h-8 max-h-8 min-h-8 !w-24 rounded border border-white bg-gradient-primary text-xs capitalize focus-within:!border-gray-300 focus-within:!ring-1 focus-within:!ring-gray-300 hover:!bg-black disabled:opacity-50 data-[hover=true]:!bg-black"
      endContent={<SendIcon size={16} />}
    >
      {getButtonText()}
    </Button>
  );
};

export default React.memo(PublishNewQuestBtn);
