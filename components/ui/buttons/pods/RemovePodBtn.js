"use client";

import { useDispatch } from "react-redux";
import { Trash2Icon } from "lucide-react";
import { addToast, Button } from "@heroui/react";
import React, { useState, useCallback } from "react";

import useUpload from "@/hooks/useUpload";

import { removePod } from "@/redux/slice/podsSlice";

const RemovePodBtn = ({ podId, name, cover_photo }) => {
  const dispatch = useDispatch();

  const { deleteFile } = useUpload();

  const [isLoading, setIsLoading] = useState(false);

  const handleDeletePod = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      // Delete cover photo using the upload hook
      if (cover_photo) {
        const success = await deleteFile(cover_photo);

        if (!success) {
          addToast({
            title: "Failed to delete cover photo",
            description: "Please delete manually or contact support.",
            color: "warning",
          });
        }
      }

      // Delete pod from database
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pods/${podId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      dispatch(removePod(podId));

      addToast({
        title: "Pod Deleted",
        description: `Pod "${name}" deleted successfully`,
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "Error Deleting Pod",
        description: "Failed to delete pod. Please try again.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  }, [podId, name, cover_photo, isLoading, dispatch, deleteFile]);

  return (
    <Button
      size="md"
      type="button"
      title="Delete Pod"
      disabled={isLoading}
      onPress={handleDeletePod}
      endContent={<Trash2Icon size={16} />}
      className="neo-button w-fit border border-red-500/80 bg-red-400/10 !px-6 !py-2.5 hover:border-red-500 hover:bg-red-400/30"
    >
      {isLoading ? "Deleting..." : "Delete"}
    </Button>
  );
};

export default React.memo(RemovePodBtn);
