"use client";

import React, { useCallback, useMemo } from "react";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";

import PodForm from "./PodForm";

import WrapperContainer from "@/components/common/WrapperContainer";
import useUpload from "@/hooks/useUpload";

// Extract constants to prevent recreation
const REQUIRED_FIELDS = [
  { field: "status", label: "Status" },
  { field: "podName", label: "Pod Name" },
  { field: "language", label: "Language" },
];

const VALIDATION_RULES = {
  podName: { min: 3, max: 50 },
  description: { max: 500 },
};

// Helper functions extracted for reusability
const validateRequiredFields = (podData) => {
  const missingFields = REQUIRED_FIELDS.filter(
    ({ field }) => !podData[field] || podData[field].trim() === "",
  );

  if (missingFields.length > 0) {
    const missingFieldLabels = missingFields.map(({ label }) => label);
    throw new Error(
      `Please fill in the following required fields: ${missingFieldLabels.join(
        ", ",
      )}`,
    );
  }
};

const validateFieldLengths = (podData) => {
  const { podName, description } = podData;

  if (podName.length < VALIDATION_RULES.podName.min) {
    throw new Error(
      `Pod name must be at least ${VALIDATION_RULES.podName.min} characters long`,
    );
  }

  if (podName.length > VALIDATION_RULES.podName.max) {
    throw new Error(
      `Pod name cannot exceed ${VALIDATION_RULES.podName.max} characters`,
    );
  }

  if (description && description.length > VALIDATION_RULES.description.max) {
    throw new Error(
      `Description cannot exceed ${VALIDATION_RULES.description.max} characters`,
    );
  }
};

// Helper function to compare arrays (matches your original logic)
const arraysAreEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  return (
    arr1.every((item) => arr2.includes(item)) &&
    arr2.every((item) => arr1.includes(item))
  );
};

const AdminEditPod = ({
  id,
  podData,
  initialPod,
  isSubmitting,
  isNew = false,
  setIsSubmitting,
  handlePodDataChange,
}) => {
  const router = useRouter();

  const { uploadFile, deleteFile, sanitizeFileName } = useUpload();

  // Memoize sanitized file name to prevent recalculation
  const sanitizedFileName = useMemo(
    () => sanitizeFileName(podData.podName),
    [podData.podName, sanitizeFileName],
  );

  const handleFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        // Validate inputs
        validateRequiredFields(podData);
        validateFieldLengths(podData);

        setIsSubmitting(true);

        // Initialize the payload as empty object (matches your original logic)
        const podPayload = {};

        // Handle cover photo upload ONLY if it's a new File object (matches your original logic)
        if (podData.coverPhoto instanceof File) {
          const success = await deleteFile(initialPod.cover_photo);

          if (!success) {
            addToast({
              title: "Failed to delete cover photo",
              description: "Please delete manually or contact support.",
              color: "danger",
            });
          }

          // Upload new cover photo first
          const coverPhotoKey = await uploadFile(podData.coverPhoto, {
            entityType: "PODS",
            fileName: sanitizedFileName,
            fileType: sanitizedFileName, // Using sanitized name as fileType for the query param
            size: "BANNER",
            multiSize: false,
            noSubfolder: true, // Matches your original logic
          });

          // Add to payload only after successful upload
          podPayload.cover_photo = coverPhotoKey.key;

          // Try to delete old cover photo (don't fail if this doesn't work)
          if (initialPod.original_cover_photo) {
            await deleteFile(initialPod.original_cover_photo);
          }
        }

        // Only add fields to payload if they have changed from initial values (matches your original logic)
        if (podData.podName !== initialPod.name) {
          podPayload.name = podData.podName.trim();
        }

        if (podData.status !== initialPod.status) {
          podPayload.status = podData.status;
        }

        if (podData.language !== initialPod.language) {
          podPayload.language = podData.language;
        }

        if (podData.description !== initialPod.description) {
          podPayload.description = podData.description
            ? podData.description.trim()
            : "";
        }

        // Handle assigned admins - compare arrays (matches your original logic)
        const initialAdmins = initialPod.admin_usernames || [];
        const currentAdmins = podData.assignedAdmins || [];

        // Check if arrays are different (using your exact comparison logic)
        const adminsChanged = !arraysAreEqual(initialAdmins, currentAdmins);

        if (adminsChanged) {
          podPayload.admin_usernames = currentAdmins;
        }

        // Only send request if there are changes to make (matches your original logic)
        if (Object.keys(podPayload).length === 0) {
          addToast({
            title: "No changes detected",
            color: "warning",
          });
          return;
        }

        // Send the request to update the pod
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/pods/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(podPayload),
            credentials: "include",
          },
        );

        // Parse the response
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to update pod");
        }

        // Redirect to pods list
        router.push("/admin/manage/pods");

        addToast({
          title: `Pod ${podData.podName} updated successfully`,
          color: "success",
        });
      } catch (error) {
        addToast({
          title: error.message || "Failed to update pod",
          color: "danger",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      podData,
      initialPod,
      id,
      router,
      sanitizedFileName,
      setIsSubmitting,
      uploadFile,
      deleteFile,
    ],
  );

  // Memoize form props to prevent unnecessary re-renders
  const formProps = useMemo(
    () => ({
      isNew,
      status: podData.status,
      setStatus: (value) => handlePodDataChange("status", value),
      podName: podData.podName,
      setPodName: (value) => handlePodDataChange("podName", value),
      language: podData.language,
      setLanguage: (value) => handlePodDataChange("language", value),
      coverPhoto: podData.coverPhoto,
      setCoverPhoto: (value) => handlePodDataChange("coverPhoto", value),
      description: podData.description,
      setDescription: (value) => handlePodDataChange("description", value),
      isSubmitting,
      handleFormSubmit,
      assignedAdmins: podData.assignedAdmins,
      handlePodDataChange: (admins) =>
        handlePodDataChange("assignedAdmins", admins),
    }),
    [isNew, podData, isSubmitting, handleFormSubmit, handlePodDataChange],
  );

  return (
    <WrapperContainer scrollable className="space-y-10 p-10">
      <PodForm {...formProps} />
    </WrapperContainer>
  );
};

export default AdminEditPod;
