"use client";

import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";

import PodForm from "./PodForm";
import useUpload from "@/hooks/useUpload";

import WrapperContainer from "@/components/common/WrapperContainer";

// Extract constants to prevent recreation
const REQUIRED_FIELDS = [
  { field: "status", label: "Status" },
  { field: "podName", label: "Pod Name" },
  { field: "language", label: "Language" },
];

const VALIDATION_RULES = {
  podName: { min: 3, max: 50 },
  description: { max: 500 },
  assignedAdmins: { min: 1 },
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
  const { podName, description, assignedAdmins = [] } = podData;

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

  if (assignedAdmins.length < VALIDATION_RULES.assignedAdmins.min) {
    throw new Error(
      `Please assign at least ${VALIDATION_RULES.assignedAdmins.min} Community Admin or Moderator`,
    );
  }

  if (assignedAdmins.length < VALIDATION_RULES.assignedAdmins.min) {
    throw new Error(
      `Please assign at least ${VALIDATION_RULES.assignedAdmins.min} Community Admin or Moderator`,
    );
  }
};

const AdminCreatePod = ({
  isNew = false,
  podData,
  isSubmitting,
  setIsSubmitting,
  handlePodDataChange,
}) => {
  const router = useRouter();
  const { uploadFile, sanitizeFileName } = useUpload();

  // Memoize sanitized file name to prevent recalculation
  const sanitizedFileName = useMemo(
    () => sanitizeFileName(podData.podName),
    [podData.podName, sanitizeFileName],
  );

  const handleFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (isSubmitting) return;

      try {
        // Validate inputs
        validateRequiredFields(podData);
        validateFieldLengths(podData);

        setIsSubmitting(true);

        // If we have a coverPhoto that's a File object (not a string URL), upload it first
        let coverPhotoKey = podData.coverPhoto;

        if (podData.coverPhoto instanceof File) {
          const coverPhoto = await uploadFile(podData.coverPhoto, {
            entityId: "",
            size: "BANNER",
            multiSize: false,
            noSubfolder: true,
            entityType: "PODS",
            fileName: sanitizedFileName,
          });

          coverPhotoKey = coverPhoto.key;
        }

        // Create the payload with all pod data, using the uploaded image key
        const podPayload = {
          name: podData.podName.trim(),
          status: podData.status,
          language: podData.language,
          cover_photo: coverPhotoKey,
          admin_usernames: podData.assignedAdmins || [],
          description: podData.description ? podData.description.trim() : "",
        };

        // Send the request to create the pod
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/pods`,
          {
            method: "POST",
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
          throw new Error(data.message || "Failed to create pod");
        }

        // Redirect to pods list
        router.push("/admin/manage/pods");

        addToast({
          title: `Pod ${podData.podName} created successfully`,
          color: "success",
        });
      } catch (error) {
        addToast({
          title: error.message || "Failed to create pod",
          color: "danger",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [podData, router, sanitizedFileName, setIsSubmitting, uploadFile],
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
    <WrapperContainer scrollable className="space-y-10 p-6 3xl:p-10">
      <PodForm {...formProps} />
    </WrapperContainer>
  );
};

export default AdminCreatePod;
