"use client";

import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";

import WebhookForm from "./WebhookForm";

const AdminCreateWebhook = ({
  webhookData,
  isSubmitting,
  setIsSubmitting,
  handleWebhookDataChange,
}) => {
  const router = useRouter();

  const handleFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        // Simple inline validation
        if (!webhookData.url?.trim()) {
          throw new Error("URL is required");
        }
        if (!webhookData.events?.length) {
          throw new Error("At least one event must be selected");
        }

        try {
          const urlObj = new URL(webhookData.url.trim());
          if (!["http:", "https:"].includes(urlObj.protocol)) {
            throw new Error("URL must use HTTP or HTTPS protocol");
          }
        } catch {
          throw new Error("Please enter a valid URL");
        }

        setIsSubmitting(true);

        const payload = {
          url: webhookData.url.trim(),
          events: webhookData.events,
        };

        if (webhookData.name?.trim()) {
          payload.name = webhookData.name.trim();
        }
        if (webhookData.description?.trim()) {
          payload.description = webhookData.description.trim();
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/webhooks`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include",
          },
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to create webhook");
        }

        router.push("/admin/webhooks");
        addToast({
          title: "Webhook created successfully",
          color: "success",
        });
      } catch (error) {
        console.error("Create webhook error:", error);
        addToast({
          title: error.message,
          color: "danger",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [webhookData, router, setIsSubmitting],
  );

  const setters = useMemo(
    () => ({
      setName: (name) => handleWebhookDataChange("name", name),
      setUrl: (url) => handleWebhookDataChange("url", url),
      setEvents: (events) => handleWebhookDataChange("events", events),
      setDescription: (description) =>
        handleWebhookDataChange("description", description),
      setStatus: (status) => handleWebhookDataChange("status", status),
    }),
    [handleWebhookDataChange],
  );

  const formProps = useMemo(
    () => ({
      isNew: true,
      name: webhookData.name,
      url: webhookData.url,
      events: webhookData.events,
      description: webhookData.description,
      status: webhookData.status,
      isSubmitting,
      handleFormSubmit,
      ...setters,
    }),
    [
      webhookData.name,
      webhookData.url,
      webhookData.events,
      webhookData.description,
      webhookData.status,
      isSubmitting,
      handleFormSubmit,
      setters,
    ],
  );

  return <WebhookForm {...formProps} />;
};

export default AdminCreateWebhook;
