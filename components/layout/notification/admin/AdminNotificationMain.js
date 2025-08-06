"use client";

import React, { useState, useCallback, useMemo } from "react";

import AdminEditNotification from "./AdminEditNotification";
import AdminCreateNotification from "./AdminCreateNotification";

import WrapperContainer from "@/components/common/WrapperContainer";

const DEFAULT_NOTIFICATION_DATA = {
  title: "",
  body: "",
  notification_type: "announcement",
  recipient_type: "all",
  recipient_ids: [],
  link_url: "",
  image_url: "",
};

const AdminNotificationMain = ({
  isNew = false,
  initialNotificationData = {},
}) => {
  const initialData = useMemo(
    () => ({
      title: initialNotificationData.title || DEFAULT_NOTIFICATION_DATA.title,
      body: initialNotificationData.body || DEFAULT_NOTIFICATION_DATA.body,
      notification_type:
        initialNotificationData.notification_type ||
        DEFAULT_NOTIFICATION_DATA.notification_type,
      recipient_type:
        initialNotificationData.recipient_type ||
        DEFAULT_NOTIFICATION_DATA.recipient_type,
      recipient_ids:
        initialNotificationData.recipient_ids ||
        DEFAULT_NOTIFICATION_DATA.recipient_ids,
      link_url:
        initialNotificationData.link_url || DEFAULT_NOTIFICATION_DATA.link_url,
      image_url:
        initialNotificationData.image_url ||
        DEFAULT_NOTIFICATION_DATA.image_url,
    }),
    [initialNotificationData],
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationData, setNotificationData] = useState(initialData);

  const handleNotificationDataChange = useCallback((field, value) => {
    setNotificationData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const FormComponent = useMemo(() => {
    const commonProps = {
      notificationData,
      isSubmitting,
      setIsSubmitting,
      handleNotificationDataChange,
    };

    return isNew ? (
      <AdminCreateNotification {...commonProps} />
    ) : (
      <AdminEditNotification
        {...commonProps}
        initialNotificationData={initialNotificationData}
      />
    );
  }, [
    isNew,
    notificationData,
    isSubmitting,
    handleNotificationDataChange,
    initialNotificationData,
  ]);

  return (
    <section className="flex flex-1 gap-4 overflow-hidden">
      <WrapperContainer scrollable className="space-y-10 p-6 3xl:p-10">
        {FormComponent}
      </WrapperContainer>

      <WrapperContainer scrollable className="p-6">
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 via-gray-900/60 to-black/40 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-semibold text-white">Preview</h3>

            <div className="space-y-4">
              {notificationData.image_url && (
                <div className="overflow-hidden rounded-lg">
                  {notificationData.image_url instanceof File ? (
                    <img
                      src={URL.createObjectURL(notificationData.image_url)}
                      alt="Notification preview"
                      className="h-32 w-full object-cover"
                    />
                  ) : (
                    <img
                      src={notificationData.image_url}
                      alt="Notification preview"
                      className="h-32 w-full object-cover"
                    />
                  )}
                </div>
              )}

              <div>
                <h4 className="mb-2 text-base font-semibold text-white">
                  {notificationData.title || "Notification Title"}
                </h4>
                <p className="text-sm leading-relaxed text-gray-300">
                  {notificationData.body ||
                    "Notification message will appear here..."}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-700 pt-2 text-xs text-gray-400">
                <div className="flex items-center gap-4">
                  <span className="rounded bg-gray-700/50 px-2 py-1 uppercase tracking-wider">
                    {notificationData.notification_type || "announcement"}
                  </span>
                  <span>
                    To:{" "}
                    {notificationData.recipient_type === "all"
                      ? "Everyone"
                      : notificationData.recipient_type === "ambassador"
                        ? "Ambassadors"
                        : "Pods"}
                  </span>
                </div>
                <span>Just now</span>
              </div>

              {notificationData.link_url &&
                notificationData.link_url.trim() && (
                  <div className="pt-2">
                    <a
                      href={notificationData.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 underline hover:text-blue-300"
                    >
                      View Link
                    </a>
                  </div>
                )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800/20 to-gray-900/40 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Delivery Info
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="capitalize text-white">
                  {notificationData.notification_type || "announcement"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Recipients:</span>
                <span className="text-white">
                  {notificationData.recipient_type === "all"
                    ? "Everyone"
                    : notificationData.recipient_type === "ambassador"
                      ? "Selected Ambassadors"
                      : notificationData.recipient_type === "pod"
                        ? "Selected Pods"
                        : "Unknown"}
                </span>
              </div>

              {notificationData.recipient_type !== "all" && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Selected:</span>
                  <span className="text-white">
                    {notificationData.recipient_ids?.length || 0} recipients
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-400">Has Link:</span>
                <span className="text-white">
                  {notificationData.link_url && notificationData.link_url.trim()
                    ? "Yes"
                    : "No"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Has Image:</span>
                <span className="text-white">
                  {notificationData.image_url ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </WrapperContainer>
    </section>
  );
};

export default AdminNotificationMain;
