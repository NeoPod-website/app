"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Trash2Icon } from "lucide-react";
import { addToast, Button, toast } from "@heroui/react";

import { removePod } from "@/redux/slice/podsSlice";

const RemovePodBtn = ({ podId, name, cover_photo }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const handleDeletePod = async () => {
    setIsLoading(true);

    try {
      const deleteResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/uploads/file/${cover_photo}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!deleteResponse.ok) {
        toast({
          title: "Failed to delete cover photo",
          description:
            "Please delete the old cover photo manually from the bucket.",
          color: "warning",
        });
      }

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
      console.error("Error deleting pod:", error);

      addToast({
        title: "Error Deleting Pod",
        description: "Failed to delete pod. Please try again.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

export default RemovePodBtn;
