"use client";

import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";

import CategoryForm from "./CategoryForm";
import useUpload from "@/hooks/useUpload";

// Reuse constants from create component
const REQUIRED_FIELDS = [
  { field: "name", label: "Title" },
  { field: "status", label: "Status" },
];

const VALIDATION_RULES = {
  name: { min: 3, max: 50 },
  description: { max: 100 },
};

// Helper functions (same as create component)
const validateRequiredFields = (categoryData) => {
  const missingFields = REQUIRED_FIELDS.filter(
    ({ field }) => !categoryData[field] || categoryData[field].trim() === "",
  );

  if (missingFields.length > 0) {
    const missingFieldLabels = missingFields.map(({ label }) => label);
    throw new Error(
      `Please fill in the following required fields: ${missingFieldLabels.join(", ")}`,
    );
  }
};

const validateFieldLengths = (categoryData) => {
  const { name, description } = categoryData;

  if (name.length < VALIDATION_RULES.name.min) {
    throw new Error(
      `Title must be at least ${VALIDATION_RULES.name.min} characters long`,
    );
  }

  if (name.length > VALIDATION_RULES.name.max) {
    throw new Error(
      `Title cannot exceed ${VALIDATION_RULES.name.max} characters`,
    );
  }

  if (description && description.length > VALIDATION_RULES.description.max) {
    throw new Error(
      `Description cannot exceed ${VALIDATION_RULES.description.max} characters`,
    );
  }
};

const AdminEditCategory = ({
  podId,
  categoryData,
  isSubmitting,
  setIsSubmitting,
  initialCategoryData,
  handleCategoryDataChange,
}) => {
  const router = useRouter();
  const { uploadFile, deleteFile, sanitizeFileName } = useUpload();

  // Memoize changed fields detection
  const changedFields = useMemo(
    () => ({
      name: categoryData.name !== initialCategoryData.name,
      status: categoryData.status !== initialCategoryData.status,
      description: categoryData.description !== initialCategoryData.description,
      coverPhoto: categoryData.cover_photo instanceof File,
      icon: categoryData.icon instanceof File,
    }),
    [categoryData, initialCategoryData],
  );

  // Memoize sanitized file name
  const sanitizedFileName = useMemo(
    () => sanitizeFileName(categoryData.name),
    [categoryData.name, sanitizeFileName],
  );

  const handleFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        // Validate inputs
        validateRequiredFields(categoryData);
        validateFieldLengths(categoryData);

        setIsSubmitting(true);

        // Build payload with only changed fields
        const categoryPayload = { pod_id: podId };

        if (changedFields.name) {
          categoryPayload.name = categoryData.name.trim();
        }

        if (changedFields.status) {
          categoryPayload.status = categoryData.status;
        }

        if (changedFields.description) {
          categoryPayload.description = categoryData.description.trim() || "";
        }

        // Process cover photo ONLY if it's a new File object
        if (categoryData.cover_photo instanceof File) {
          const success = await deleteFile(initialCategoryData.cover_photo);

          if (!success) {
            addToast({
              title: "Failed to delete cover photo",
              description: "Please delete manually or contact support.",
              color: "danger",
            });
          }

          const coverPhotoKey = await uploadFile(categoryData.cover_photo, {
            entityType: "QUEST_CATEGORIES",
            entityId: sanitizedFileName,
            fileName: sanitizedFileName,
            fileType: "cover_photo",
            size: "BANNER",
            multiSize: false,
            noSubfolder: false,
          });

          // Add to payload only if it's a new file
          categoryPayload.cover_photo = coverPhotoKey.key;

          // Try to delete old cover photo if available
          if (initialCategoryData.original_cover_photo) {
            await deleteFile(initialCategoryData.original_cover_photo);
          }
        }

        // Process icon ONLY if it's a new File object
        if (categoryData.icon instanceof File) {
          const success = await deleteFile(initialCategoryData.icon);

          if (!success) {
            addToast({
              title: "Failed to delete icon",
              description: "Please delete manually or contact support.",
              color: "danger",
            });
          }

          const iconKey = await uploadFile(categoryData.icon, {
            entityType: "QUEST_CATEGORIES",
            entityId: sanitizedFileName,
            fileName: sanitizedFileName,
            fileType: "icon",
            size: "THUMBNAIL",
            multiSize: false,
            noSubfolder: false,
          });

          // Add to payload only if it's a new file
          categoryPayload.icon = iconKey.key;

          // Try to delete old icon if available
          if (initialCategoryData.original_icon) {
            await deleteFile(initialCategoryData.original_icon);
          }
        }

        // Update category
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories/${initialCategoryData.category_id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categoryPayload),
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to update category");
        }

        // Success handling
        router.push(`/admin/manage/categories/${podId}`);
        addToast({
          title: `Category ${categoryData.name} updated successfully`,
          color: "success",
        });
      } catch (error) {
        addToast({
          title: error.message || "Failed to update category",
          color: "danger",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      categoryData,
      podId,
      router,
      sanitizedFileName,
      setIsSubmitting,
      initialCategoryData,
      changedFields,
      uploadFile,
      deleteFile,
    ],
  );

  // Create setter callbacks for specific fields
  const setIcon = useCallback(
    (icon) => handleCategoryDataChange("icon", icon),
    [handleCategoryDataChange],
  );

  const setTitle = useCallback(
    (name) => handleCategoryDataChange("name", name),
    [handleCategoryDataChange],
  );

  const setStatus = useCallback(
    (status) => handleCategoryDataChange("status", status),
    [handleCategoryDataChange],
  );

  const setSelectedFile = useCallback(
    (cover_photo) => handleCategoryDataChange("cover_photo", cover_photo),
    [handleCategoryDataChange],
  );

  const setDescription = useCallback(
    (description) => handleCategoryDataChange("description", description),
    [handleCategoryDataChange],
  );

  // Memoize form props to prevent unnecessary re-renders
  const formProps = useMemo(
    () => ({
      isNew: false,
      podId,
      icon: categoryData.icon,
      setIcon,
      title: categoryData.name,
      setTitle,
      status: categoryData.status,
      setStatus,
      selectedFile: categoryData.cover_photo,
      setSelectedFile,
      description: categoryData.description,
      setDescription,
      isSubmitting,
      handleFormSubmit,
    }),
    [
      podId,
      categoryData.icon,
      categoryData.name,
      categoryData.status,
      categoryData.cover_photo,
      categoryData.description,
      isSubmitting,
      setIcon,
      setTitle,
      setStatus,
      setSelectedFile,
      setDescription,
      handleFormSubmit,
    ],
  );

  return <CategoryForm {...formProps} />;
};

export default AdminEditCategory;
