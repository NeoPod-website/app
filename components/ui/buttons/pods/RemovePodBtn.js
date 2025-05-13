"use client";

import React, { useState } from "react";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { addToast, Button } from "@heroui/react";

const RemovePodBtn = ({ podId, name }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleDeletePod = async () => {
    setIsLoading(true);

    try {
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

      router.refresh();

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
      className="neo-button w-fit border border-red-500 bg-red-400/20 !px-4 hover:border-red-400/80 hover:bg-red-400/10"
    >
      {isLoading ? "Deleting..." : "Delete"}
    </Button>
  );
};

export default RemovePodBtn;
