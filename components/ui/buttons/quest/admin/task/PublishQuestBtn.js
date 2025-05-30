"use client";

import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import UpdateQuestBtn from "./UpdateQuestBtn";
import PublishNewQuestBtn from "./PublishNewQuestBtn";

import { resetCurrentQuest } from "@/redux/slice/questSlice";

const PublishQuestBtn = ({ isNew, podId, categoryId, questId }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const currentQuest = useSelector((state) => state.quest.currentQuest);

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateQuest = useCallback(
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
          tasks: currentQuest.tasks,
          rewards: currentQuest.rewards,
          name: currentQuest.name.trim(),
          pod_id: podId || currentQuest.podId,
          description: currentQuest.description.trim(),
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
        if (currentQuest.cooldown && currentQuest.cooldown !== "cooldown") {
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

        router.push(`/admin/manage/quests/${podId}`);

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

  const handleUpdateQuest = useCallback(
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
          tasks: currentQuest.tasks,
          rewards: currentQuest.rewards,
          name: currentQuest.name.trim(),
          description: currentQuest.description.trim(),
          status: statusMapping[selectedStatus] || selectedStatus,
        };

        if (categoryId && categoryId !== currentQuest.categoryId) {
          questData.category_id = currentQuest.categoryId;
        }

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

        if (typeof currentQuest.limit === "number" && currentQuest.limit > 0) {
          questData.limit = currentQuest.limit;
        }

        if (currentQuest.recurrence && currentQuest.recurrence !== "never") {
          questData.recurrence = currentQuest.recurrence;
        }

        if (currentQuest.cooldown && currentQuest.cooldown !== "cooldown") {
          questData.cooldown = currentQuest.cooldown;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/quests/${questId}`,
          {
            method: "PATCH",
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

        router.push(`/admin/manage/quests/${podId}`);

        // Reset the current quest after successful update
        dispatch(resetCurrentQuest());

        // Success messages based on status for updates
        const statusMessages = {
          publish: "updated and published successfully",
          draft: "updated and saved as draft",
          archive: "updated and archived",
        };

        addToast({
          title: "Quest Updated Successfully",
          description: `Quest "${questData.name}" has been ${statusMessages[selectedStatus]}`,
          color: "success",
        });
      } catch (error) {
        console.error("Error updating quest:", error);

        addToast({
          title: "Failed to Update Quest",
          description:
            error.message || "Please check your input and try again.",
          color: "danger",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [currentQuest, podId, categoryId, questId, isLoading, dispatch, router],
  );

  return isNew ? (
    <PublishNewQuestBtn
      isLoading={isLoading}
      handleCreateQuest={handleCreateQuest}
    />
  ) : (
    <UpdateQuestBtn
      isLoading={isLoading}
      handleUpdateQuest={handleUpdateQuest}
    />
  );
};

export default React.memo(PublishQuestBtn);
