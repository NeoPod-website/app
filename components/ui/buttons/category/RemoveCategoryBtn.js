"use client";

import { Trash2Icon } from "lucide-react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { addToast, Button } from "@heroui/react";
import React, { useState, useCallback } from "react";

import useUpload from "@/hooks/useUpload";

import {
  toggleDeleteConfirmationModal,
  setDeleteModalData,
} from "@/redux/slice/modalsSlice";

const RemoveCategoryBtn = ({ category }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { deleteEntityFiles, sanitizeFileName } = useUpload();

  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteCategory = useCallback(async () => {
    setIsLoading(true);

    const fileName = sanitizeFileName(category.pod_id);

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
  }, [category, router, deleteEntityFiles, sanitizeFileName]);

  const handleOpenDeleteModal = useCallback(() => {
    dispatch(
      setDeleteModalData({
        itemType: "category",
        itemName: category.name,
        onConfirmDelete: handleDeleteCategory,
        isDeleting: isLoading,
      }),
    );

    dispatch(toggleDeleteConfirmationModal());
  }, [dispatch, category.name, handleDeleteCategory, isLoading]);

  return (
    <Button
      size="md"
      type="button"
      title="Delete Category"
      disabled={isLoading}
      onPress={handleOpenDeleteModal}
      endContent={<Trash2Icon size={16} />}
      className="neo-button w-fit border border-red-500/80 bg-red-400/10 !px-6 !py-2.5 hover:border-red-500 hover:bg-red-400/30"
    >
      {isLoading ? "Deleting..." : "Delete"}
    </Button>
  );
};

export default RemoveCategoryBtn;
