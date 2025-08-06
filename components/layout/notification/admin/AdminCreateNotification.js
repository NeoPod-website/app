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

const AdminCreateNotification = ({
  notificationData,
  isSubmitting,
  setIsSubmitting,
  handleNotificationDataChange,
}) => {
  const router = useRouter();
  const { uploadFile, sanitizeFileName } = useUpload();

  const sanitizedFileName = useMemo(
    () => sanitizeFileName(notificationData.title || "notification"),
    [notificationData.title, sanitizeFileName],
  );

  // FIXED: Remove created_at from payload - backend handles this
  const handleFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        validateRequiredFields(notificationData);
        validateFieldLengths(notificationData);
        validateRecipients(notificationData);

        // ADDED: URL validation
        if (notificationData.link_url && notificationData.link_url.trim()) {
          try {
            new URL(notificationData.link_url.trim());
          } catch {
            throw new Error("Please enter a valid URL");
          }
        }

        setIsSubmitting(true);

        let imageUrl = notificationData.image_url;

        if (notificationData.image_url instanceof File) {
          const uploadResult = await uploadFile(notificationData.image_url, {
            size: "BANNER",
            entityId: "notifications",
            fileName: "notification_image",
            entityType: "NOTIFICATIONS",
            subEntityId: sanitizedFileName,
            multiSize: false,
            noSubfolder: false,
          });
          imageUrl = uploadResult.key;
        }

        const notificationPayload = {
          title: notificationData.title.trim(),
          body: notificationData.body.trim(),
          notification_type: notificationData.notification_type,
          recipient_type: notificationData.recipient_type,
          recipient_ids:
            notificationData.recipient_type === "all"
              ? ["all"]
              : notificationData.recipient_ids,
          // REMOVED: created_at - backend sets this automatically
        };

        // Only add optional fields if they have values
        if (notificationData.link_url && notificationData.link_url.trim()) {
          notificationPayload.link_url = notificationData.link_url.trim();
        }

        if (imageUrl && imageUrl.trim()) {
          notificationPayload.image_url = imageUrl;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(notificationPayload),
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          // ENHANCED: Better error handling
          if (response.status === 403) {
            throw new Error(
              "You don't have permission to create notifications",
            );
          } else if (response.status === 400) {
            throw new Error(data.message || "Invalid notification data");
          }
          throw new Error(data.message || "Failed to create notification");
        }

        router.push("/admin/notifications");
        addToast({
          title: `Notification "${notificationData.title}" created successfully`,
          color: "success",
        });
      } catch (error) {
        console.error("Error creating notification:", error);
        addToast({
          title: error.message || "Failed to create notification",
          color: "danger",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [notificationData, router, sanitizedFileName, setIsSubmitting, uploadFile],
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
      isNew: true,
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

export default AdminCreateNotification;
