"use client";

import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";

import CategoryForm from "./CategoryForm";
import useUpload from "@/hooks/useUpload";

// Extract constants to prevent recreation
const REQUIRED_FIELDS = [
  { field: "name", label: "Title" },
  { field: "status", label: "Status" },
];

const VALIDATION_RULES = {
  name: { min: 3, max: 50 },
  description: { max: 100 },
};

// Helper functions extracted for reusability
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

const AdminCreateCategory = ({
  podId,
  categoryData,
  isSubmitting,
  setIsSubmitting,
  handleCategoryDataChange,
}) => {
  const router = useRouter();
  const { uploadFile, sanitizeFileName } = useUpload();

  // Memoize sanitized file name to prevent recalculation
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

        // Handle file uploads concurrently for better performance
        const uploadPromises = [];
        let coverPhotoKey = categoryData.cover_photo;
        let iconKey = categoryData.icon;

        if (categoryData.cover_photo instanceof File) {
          uploadPromises.push(
            uploadFile(categoryData.cover_photo, {
              entityType: "QUEST_CATEGORIES",
              entityId: podId + "-" + sanitizedFileName,
              fileName: sanitizedFileName,
              fileType: "cover_photo",
              size: "BANNER",
              multiSize: false,
              noSubfolder: false,
            }).then((cover_photo) => {
              coverPhotoKey = cover_photo.key;
            }),
          );
        }

        if (categoryData.icon instanceof File) {
          uploadPromises.push(
            uploadFile(categoryData.icon, {
              entityType: "QUEST_CATEGORIES",
              entityId: podId + "-" + sanitizedFileName,
              fileName: sanitizedFileName,
              fileType: "icon",
              size: "THUMBNAIL",
              multiSize: false,
              noSubfolder: false,
            }).then((icon) => {
              iconKey = icon.key;
            }),
          );
        }

        // Wait for all uploads to complete
        await Promise.all(uploadPromises);

        // Create the payload
        const categoryPayload = {
          icon: iconKey,
          pod_id: podId,
          cover_photo: coverPhotoKey,
          status: categoryData.status,
          name: categoryData.name.trim(),
          description: categoryData.description
            ? categoryData.description.trim()
            : "",
        };

        // Create category
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categoryPayload),
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to create category");
        }

        // Success handling
        router.push(`/admin/manage/categories/${podId}`);
        addToast({
          title: `Category ${categoryData.name} created successfully`,
          color: "success",
        });
      } catch (error) {
        addToast({
          title: error.message || "Failed to create category",
          color: "warning",
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
      uploadFile,
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
      isNew: true,
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

export default AdminCreateCategory;
