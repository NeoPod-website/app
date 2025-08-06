"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BellRingIcon, Eye, Clock, SquarePenIcon, Trash2 } from "lucide-react";
import { addToast } from "@heroui/react";

import {
  formatTimeAgo,
  getTypeColor,
} from "@/components/layout/notification/notificationUtils";
import DeleteNotificationButton from "@/components/ui/buttons/notifications/DeleteNotificationButton";

const getRecipientLabel = (recipientType, recipientIds = []) => {
  switch (recipientType) {
    case "ambassador":
      return `${recipientIds.length || 0} Ambassadors`;
    case "pod":
      return `${recipientIds.length || 0} Pods`;
    case "all":
      return "Everyone";
    default:
      return "Unknown";
  }
};

const AdminNotificationItem = ({ notification, index, isToday = false }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const backgroundClass = isToday ? "bg-gradient-dark" : "bg-gray-700";

  const handleDelete = async () => {
    if (isDeleting) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete the notification "${notification.title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notification.notification_id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete notification");
      }

      addToast({
        title: "Notification deleted successfully",
        color: "success",
      });

      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      console.error("Error deleting notification:", error);
      addToast({
        title: error.message || "Failed to delete notification",
        color: "danger",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <li
      className={`group relative overflow-hidden rounded-2xl border border-gray-400 ${backgroundClass} backdrop-blur-sm transition-all duration-300 hover:border-gray-600/70 hover:shadow-2xl hover:shadow-purple-500/10`}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-emerald-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-1 items-start gap-4">
            <div className="flex-shrink-0">
              <div
                className={`rounded-xl bg-gradient-to-br ${getTypeColor(notification.notification_type)} p-3 shadow-lg transition-transform duration-300 group-hover:scale-110`}
              >
                <BellRingIcon size={24} className="text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h3 className="truncate font-work-sans text-xl font-bold text-white transition-colors duration-300 group-hover:text-purple-300">
                  {notification.title}
                </h3>

                <span className="rounded-full border border-gray-500/50 bg-gray-700/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-gray-200">
                  {notification.notification_type}
                </span>
              </div>

              <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-100">
                {notification.body}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-200">
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  <span>
                    {getRecipientLabel(
                      notification.recipient_type,
                      notification.recipient_ids,
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{formatTimeAgo(notification.created_at)}</span>
                </div>

                <div className="text-xs">by {notification.sender_admin}</div>
              </div>
            </div>
          </div>

          <div className="flex translate-x-4 transform items-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            <Link
              href={`/admin/notifications/${notification.notification_id}`}
              className="hover:bg-blue-500/50 z-10 rounded-lg bg-gray-700/50 p-2 transition-colors duration-200"
            >
              <SquarePenIcon
                size={16}
                className="text-gray-200 hover:text-white"
              />
            </Link>

            <DeleteNotificationButton
              title={notification.title}
              notificationId={notification.notification_id}
            />
          </div>
        </div>
      </div>
    </li>
  );
};

export default AdminNotificationItem;
