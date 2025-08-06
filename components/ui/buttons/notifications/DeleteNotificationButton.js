"use client";

import { useDispatch } from "react-redux";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { addToast, Button } from "@heroui/react";
import React, { useState, useCallback } from "react";

import {
  setDeleteModalData,
  toggleDeleteConfirmationModal,
} from "@/redux/slice/modalsSlice";

const DeleteNotificationButton = ({ notificationId, title }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteNotification = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      addToast({
        color: "success",
        title: "Notification Deleted",
        description: `Notification "${title}" deleted successfully`,
      });

      window.location.reload();
    } catch (error) {
      console.log("Notification deletion error:", error);
      addToast({
        color: "danger",
        title: "Error Deleting Notification",
        description:
          error.message || "Failed to delete notification. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [notificationId, title, isLoading, dispatch]);

  const handleOpenDeleteModal = useCallback(() => {
    dispatch(
      setDeleteModalData({
        itemType: "notification",
        itemName: title,
        onConfirmDelete: handleDeleteNotification,
        isDeleting: isLoading,
      }),
    );

    dispatch(toggleDeleteConfirmationModal());
  }, [dispatch, title, handleDeleteNotification, isLoading]);

  return (
    <Button
      size="md"
      isIconOnly
      type="button"
      disabled={isLoading}
      title="Delete Notification"
      onPress={handleOpenDeleteModal}
      endContent={<Trash2Icon size={16} />}
      className="neo-button w-fit min-w-0 border border-red-500/80 bg-red-400/10 hover:border-red-500 hover:bg-red-400/30"
    />
  );
};

export default React.memo(DeleteNotificationButton);
