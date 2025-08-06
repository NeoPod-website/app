"use client";

import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";

import useUpload from "@/hooks/useUpload";
import NotificationForm from "./NotificationForm";

const REQUIRED_FIELDS = [
  { field: "title", label: "Title" },
  { field: "body", label: "Message" },
  { field: "notification_type", label: "Notification Type" },
  { field: "recipient_type", label: "Recipient Type" },
];

const VALIDATION_RULES = {
  title: { min: 3, max: 100 },
  body: { min: 10, max: 500 },
};

const validateRequiredFields = (notificationData) => {
  const missingFields = REQUIRED_FIELDS.filter(
    ({ field }) =>
      !notificationData[field] ||
      notificationData[field].toString().trim() === "",
  );

  if (missingFields.length > 0) {
    const missingFieldLabels = missingFields.map(({ label }) => label);
    throw new Error(
      `Please fill in the following required fields: ${missingFieldLabels.join(", ")}`,
    );
  }
};

const validateFieldLengths = (notificationData) => {
  const { title, body } = notificationData;

  if (title.length < VALIDATION_RULES.title.min) {
    throw new Error(
      `Title must be at least ${VALIDATION_RULES.title.min} characters long`,
    );
  }

  if (title.length > VALIDATION_RULES.title.max) {
    throw new Error(
      `Title cannot exceed ${VALIDATION_RULES.title.max} characters`,
    );
  }

  if (body.length < VALIDATION_RULES.body.min) {
    throw new Error(
      `Message must be at least ${VALIDATION_RULES.body.min} characters long`,
    );
  }

  if (body.length > VALIDATION_RULES.body.max) {
    throw new Error(
      `Message cannot exceed ${VALIDATION_RULES.body.max} characters`,
    );
  }
};

const validateRecipients = (notificationData) => {
  if (
    notificationData.recipient_type !== "all" &&
    (!notificationData.recipient_ids ||
      notificationData.recipient_ids.length === 0)
  ) {
    throw new Error("Please select at least one recipient");
  }
};

// ADDED: URL validation
const validateUrl = (url) => {
  if (!url || !url.trim()) return true; // Optional field
  try {
    new URL(url.trim());
    return true;
  } catch {
    throw new Error("Please enter a valid URL");
  }
};

const AdminEditNotification = ({
  notificationData,
  isSubmitting,
  setIsSubmitting,
  initialNotificationData,
  handleNotificationDataChange,
}) => {
  const router = useRouter();
  const { uploadFile, deleteFile, sanitizeFileName } = useUpload();

  const changedFields = useMemo(
    () => ({
      title: notificationData.title !== initialNotificationData.title,
      body: notificationData.body !== initialNotificationData.body,
      notification_type:
        notificationData.notification_type !==
        initialNotificationData.notification_type,
      recipient_type:
        notificationData.recipient_type !==
        initialNotificationData.recipient_type,
      recipient_ids:
        JSON.stringify(notificationData.recipient_ids || []) !==
        JSON.stringify(initialNotificationData.recipient_ids || []),
      link_url: notificationData.link_url !== initialNotificationData.link_url,
      image: notificationData.image_url instanceof File,
    }),
    [notificationData, initialNotificationData],
  );

  const sanitizedFileName = useMemo(
    () => sanitizeFileName(notificationData.title || "notification"),
    [notificationData.title, sanitizeFileName],
  );

  const handleFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        validateRequiredFields(notificationData);
        validateFieldLengths(notificationData);
        validateRecipients(notificationData);

        // ADDED: URL validation
        if (notificationData.link_url) {
          validateUrl(notificationData.link_url);
        }

        setIsSubmitting(true);

        const notificationPayload = {};

        if (changedFields.title) {
          notificationPayload.title = notificationData.title.trim();
        }

        if (changedFields.body) {
          notificationPayload.body = notificationData.body.trim();
        }

        if (changedFields.notification_type) {
          notificationPayload.notification_type =
            notificationData.notification_type;
        }

        if (changedFields.recipient_type) {
          notificationPayload.recipient_type = notificationData.recipient_type;
        }

        if (changedFields.recipient_ids) {
          notificationPayload.recipient_ids =
            notificationData.recipient_type === "all"
              ? ["all"]
              : notificationData.recipient_ids;
        }

        // FIXED: Handle link_url properly including removal
        if (changedFields.link_url) {
          const linkValue = notificationData.link_url?.trim();
          // Send empty string to remove link, or the actual URL
          notificationPayload.link_url = linkValue || "";
        }

        // Handle image upload/update
        if (notificationData.image_url instanceof File) {
          // Delete old image if it exists
          if (initialNotificationData.image_url) {
            try {
              const success = await deleteFile(
                initialNotificationData.image_url,
              );
              if (!success) {
                console.warn(
                  "Failed to delete old image, but continuing with update",
                );
              }
            } catch (error) {
              console.error("Error deleting old image:", error);
              // Continue with upload even if delete fails
            }
          }

          // Upload new image
          try {
            const uploadResult = await uploadFile(notificationData.image_url, {
              size: "BANNER",
              entityId: "notifications",
              fileName: "notification_image",
              entityType: "NOTIFICATIONS",
              subEntityId: sanitizedFileName,
              multiSize: false,
              noSubfolder: false,
            });

            if (uploadResult.key) {
              notificationPayload.image_url = uploadResult.key;
            }
          } catch (uploadError) {
            throw new Error(
              "Failed to upload new image: " + uploadError.message,
            );
          }
        }

        // Only make API call if there are changes
        if (Object.keys(notificationPayload).length === 0) {
          addToast({
            title: "No changes detected",
            description: "Make some changes before updating",
            color: "warning",
          });
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/notifications/${initialNotificationData.notification_id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(notificationPayload),
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          // ENHANCED: Better error handling
          if (response.status === 401) {
            throw new Error("Authentication failed - please login again");
          } else if (response.status === 403) {
            throw new Error("You can only edit your own notifications");
          } else if (response.status === 404) {
            throw new Error(
              "Notification not found - it may have been deleted",
            );
          } else if (response.status === 400) {
            throw new Error(data.message || "Invalid notification data");
          }
          throw new Error(data.message || "Failed to update notification");
        }

        router.push("/admin/notifications");
        addToast({
          title: `Notification "${notificationData.title}" updated successfully`,
          color: "success",
        });
      } catch (error) {
        console.error("Error updating notification:", error);
        addToast({
          title: error.message || "Failed to update notification",
          color: "danger",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      notificationData,
      router,
      sanitizedFileName,
      setIsSubmitting,
      initialNotificationData,
      changedFields,
      uploadFile,
      deleteFile,
    ],
  );

  const setTitle = useCallback(
    (title) => handleNotificationDataChange("title", title),
    [handleNotificationDataChange],
  );

  const setBody = useCallback(
    (body) => handleNotificationDataChange("body", body),
    [handleNotificationDataChange],
  );

  const setNotificationType = useCallback(
    (notification_type) =>
      handleNotificationDataChange("notification_type", notification_type),
    [handleNotificationDataChange],
  );

  const setRecipientType = useCallback(
    (recipient_type) =>
      handleNotificationDataChange("recipient_type", recipient_type),
    [handleNotificationDataChange],
  );

  const setRecipientIds = useCallback(
    (recipient_ids) =>
      handleNotificationDataChange("recipient_ids", recipient_ids),
    [handleNotificationDataChange],
  );

  const setLinkUrl = useCallback(
    (link_url) => handleNotificationDataChange("link_url", link_url),
    [handleNotificationDataChange],
  );

  const setImageFile = useCallback(
    (image_url) => handleNotificationDataChange("image_url", image_url),
    [handleNotificationDataChange],
  );

  const formProps = useMemo(
    () => ({
      isNew: false,
      title: notificationData.title,
      setTitle,
      body: notificationData.body,
      setBody,
      notificationType: notificationData.notification_type,
      setNotificationType,
      recipientType: notificationData.recipient_type,
      setRecipientType,
      recipientIds: notificationData.recipient_ids,
      setRecipientIds,
      linkUrl: notificationData.link_url,
      setLinkUrl,
      imageFile: notificationData.image_url,
      setImageFile,
      isSubmitting,
      handleFormSubmit,
    }),
    [
      notificationData.title,
      notificationData.body,
      notificationData.notification_type,
      notificationData.recipient_type,
      notificationData.recipient_ids,
      notificationData.link_url,
      notificationData.image_url,
      isSubmitting,
      setTitle,
      setBody,
      setNotificationType,
      setRecipientType,
      setRecipientIds,
      setLinkUrl,
      setImageFile,
      handleFormSubmit,
    ],
  );

  return <NotificationForm {...formProps} />;
};

export default AdminEditNotification;
