"use client";

import React, { useState } from "react";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { addToast, Button } from "@heroui/react";

const RemoveCategoryBtn = ({ category }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteCategory = async () => {
    setIsLoading(true);

    const fileName = category.name
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    try {
      const deleteResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/uploads/entity/QUEST_CATEGORIES/${fileName}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!deleteResponse.ok) {
        addToast({
          title: "Failed to delete category files",
          description:
            "Please delete the old cover photo and icon manually from the bucket.",
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
    } catch (error) {
      console.error("Error deleting category:", error);

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
