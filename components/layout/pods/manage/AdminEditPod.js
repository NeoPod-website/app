"use client";

import React from "react";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";

import PodForm from "./PodForm";

import WrapperContainer from "@/components/common/WrapperContainer";

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      const requiredFields = [
        { field: "status", label: "Status" },
        { field: "podName", label: "Pod Name" },
        { field: "language", label: "Language" },
      ];

      // Check for empty required fields
      const missingFields = requiredFields.filter(
        ({ field }) => !podData[field] || podData[field].trim() === "",
      );

      if (missingFields.length > 0) {
        const missingFieldLabels = missingFields.map(({ label }) => label);

        throw new Error(
          `Please fill in the following required fields: ${missingFieldLabels.join(", ")}`,
        );
      }

      // Additional validations
      if (podData.podName.length < 3) {
        throw new Error("Pod name must be at least 3 characters long");
      }

      if (podData.podName.length > 50) {
        throw new Error("Pod name cannot exceed 50 characters");
      }

      if (podData.description && podData.description.length > 500) {
        throw new Error("Description cannot exceed 500 characters");
      }

      // Set loading state after validations pass
      setIsSubmitting(true);

      // Initialize the payload as empty object
      const podPayload = {};

      // Handle cover photo upload if it's a new File object
      if (podData.coverPhoto instanceof File) {
        // Create form data for the image upload
        const formData = new FormData();
        formData.append("file", podData.coverPhoto);

        // Sanitize the file name to remove special characters and spaces
        const fileName = podData.podName
          .replace(/[^a-zA-Z0-9-_]/g, "-")
          .toLowerCase();

        // Upload the image
        const uploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/uploads/single/PODS?noSubfolder=true&size=BANNER&fileName=${encodeURIComponent(fileName)}`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          },
        );

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(`Failed to upload cover photo: ${errorText}`);
        }

        // Get the key from the response and add to payload
        const uploadData = await uploadResponse.json();
        podPayload.cover_photo = uploadData.data.key;

        // Try to delete old cover photo (don't fail if this doesn't work)
        if (initialPod.original_cover_photo) {
          try {
            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/uploads/file/${initialPod.original_cover_photo}`,
              {
                method: "DELETE",
                credentials: "include",
              },
            );
          } catch (error) {
            console.warn("Failed to delete old cover photo:", error);
          }
        }
      }

      // Only add fields to payload if they have changed from initial values
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

      // Handle assigned admins - compare arrays
      const initialAdmins = initialPod.admin_usernames || [];
      const currentAdmins = podData.assignedAdmins || [];

      // Check if arrays are different (simple comparison)
      const adminsChanged =
        initialAdmins.length !== currentAdmins.length ||
        !initialAdmins.every((admin) => currentAdmins.includes(admin)) ||
        !currentAdmins.every((admin) => initialAdmins.includes(admin));

      if (adminsChanged) {
        podPayload.admin_usernames = currentAdmins;
      }

      console.log("Final podPayload:", podPayload);

      // Only send request if there are changes to make
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
        color: "warning",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WrapperContainer scrollable className="space-y-10 p-10">
      <PodForm
        isNew={isNew}
        status={podData.status}
        setStatus={(value) => handlePodDataChange("status", value)}
        podName={podData.podName}
        setPodName={(value) => handlePodDataChange("podName", value)}
        language={podData.language}
        setLanguage={(value) => handlePodDataChange("language", value)}
        coverPhoto={podData.coverPhoto}
        setCoverPhoto={(value) => handlePodDataChange("coverPhoto", value)}
        description={podData.description}
        setDescription={(value) => handlePodDataChange("description", value)}
        isSubmitting={isSubmitting}
        handleFormSubmit={handleFormSubmit}
        assignedAdmins={podData.assignedAdmins}
        handlePodDataChange={(admins) =>
          handlePodDataChange("assignedAdmins", admins)
        }
      />
    </WrapperContainer>
  );
};

export default AdminEditPod;
