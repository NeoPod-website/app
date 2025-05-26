"use client";

import React, { useState } from "react";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { addToast, Button } from "@heroui/react";

import useUpload from "@/hooks/useUpload";

const RemoveCategoryBtn = ({ category }) => {
  const router = useRouter();
  const { deleteEntityFiles, sanitizeFileName } = useUpload();

  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteCategory = async () => {
    setIsLoading(true);

    const fileName = sanitizeFileName(category.name);

    try {
      const success = await deleteEntityFiles(fileName, {
        entityType: "QUEST_CATEGORIES",
      });

      if (!success) {
        addToast({
          title: "Failed to delete category files",
          description: "Please delete the files manually or contact support.",
          color: "warning",
        });
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${category.category_id}`,
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
        title: "Category Deleted",
        description: `Category "${category.name}" deleted successfully`,
        color: "success",
      });
    } catch {
      addToast({
        title: "Error Deleting Category",
        description: "Failed to delete category. Please try again.",
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
      title="Delete Category"
      disabled={isLoading}
      onPress={handleDeleteCategory}
      endContent={<Trash2Icon size={16} />}
      className="neo-button w-fit border border-red-500/80 bg-red-400/10 !px-6 !py-2.5 hover:border-red-500 hover:bg-red-400/30"
    >
      {isLoading ? "Deleting..." : "Delete"}
    </Button>
  );
};

export default RemoveCategoryBtn;
