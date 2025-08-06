import Link from "next/link";
import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { BellIcon, BellPlusIcon } from "lucide-react";

import MainPageScroll from "@/components/common/MainPageScroll";
import WrapperContainer from "@/components/common/WrapperContainer";

import LoadMoreAdminNotifications from "@/components/layout/notification/admin/LoadMoreAdminNotifications";

import {
  groupNotificationsByTime,
  calculateNotificationStats,
} from "@/components/layout/notification/notificationUtils";
import DeleteConfirmationModal from "@/components/ui/modals/DeleteConfirmationModal";

export const metadata = {
  title: "Notifications | Admin Panel | NeoPod",
  description:
    "Send important updates, announcements, and alerts to the NeoPod community. Manage communication effectively with your ambassadors.",
};

// Fetch admin's notifications with proper authentication
const fetchAdminNotifications = async (limit = 20, lastKey = null) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  const params = new URLSearchParams({
    limit: limit.toString(),
  });

  if (lastKey) {
    params.append("lastEvaluatedKey", lastKey);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications/admin?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      credentials: "include",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    if (response.status === 403) {
      notFound();
    }

    if (response.status === 404) {
      return {
        notifications: [],
        pagination: { hasMore: false, nextKey: null },
      };
    }

    throw new Error(`Failed to fetch admin notifications: ${response.status}`);
  }

  const data = await response.json();

  return {
    notifications: data.data?.notifications || [],
    pagination: {
      hasMore: data.data?.pagination?.has_more || false,
      nextKey: data.data?.pagination?.next_key || null,
    },
    totalResults: data.results || 0,
  };
};

const AdminNotificationsPage = async () => {
  // Fetch initial admin notifications
  const notificationData = await fetchAdminNotifications(2);

  // Calculate stats and groupings
  const { totalShown, typeStats } = calculateNotificationStats(
    notificationData.notifications,
  );
  const { todayNotifications, yesterdayNotifications, olderNotifications } =
    groupNotificationsByTime(notificationData.notifications);

  if (notificationData.notifications.length === 0) {
    return (
      <MainPageScroll scrollable={false}>
        <WrapperContainer
          scrollable={true}
          className="space-y-8 p-3 md:p-4 lg:p-6 3xl:p-10"
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="space-y-2">
              <h2 className="font-work-sans text-2xl font-bold xl:text-3xl 3xl:text-4xl">
                Notifications
              </h2>

              <p className="text-lg text-gray-400">
                Manage and send updates to your community
              </p>
            </div>

            <Link
              href="/admin/notifications/create"
              className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 px-8 py-4 font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25"
            >
              <div className="absolute inset-0 bg-gradient-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <span className="relative z-10">Create Notification</span>

              <BellPlusIcon
                size={20}
                className="relative z-10 transition-transform duration-300 group-hover:rotate-12"
              />
            </Link>
          </div>

          <div className="py-16 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gray-700/50 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm">
              <BellIcon size={32} className="text-gray-400" />
            </div>

            <h3 className="mb-2 text-xl font-semibold text-white">
              No notifications yet
            </h3>

            <p className="mb-6 text-gray-400">
              Start engaging with your community by creating your first
              notification.
            </p>

            <Link
              href="/admin/notifications/create"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-purple-500/25"
            >
              Create Your First Notification
              <BellPlusIcon size={16} />
            </Link>
          </div>
        </WrapperContainer>
      </MainPageScroll>
    );
  }

  return (
    <MainPageScroll scrollable={false}>
      <DeleteConfirmationModal />

      <div className="flex h-full flex-1 gap-4">
        <WrapperContainer
          scrollable={true}
          className="space-y-8 p-3 md:p-4 lg:p-6 3xl:p-10"
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="space-y-2">
              <h2 className="font-work-sans text-2xl font-bold xl:text-3xl 3xl:text-4xl">
                Notifications
              </h2>

              <p className="text-lg text-gray-200">
                Manage and send updates to your community
              </p>
            </div>

            <Link
              href="/admin/notifications/create"
              className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white bg-gradient-primary px-8 py-4 font-semibold text-white shadow-2xl transition-all duration-300"
            >
              <span className="relative z-10">Create Notification</span>

              <BellPlusIcon
                size={20}
                className="relative z-10 transition-transform duration-300 group-hover:rotate-12"
              />
            </Link>
          </div>

          <Suspense>
            <LoadMoreAdminNotifications
              todayNotifications={todayNotifications}
              olderNotifications={olderNotifications}
              yesterdayNotifications={yesterdayNotifications}
              initialNextKey={notificationData.pagination.nextKey}
              initialHasMore={notificationData.pagination.hasMore}
              initialNotifications={notificationData.notifications}
            />
          </Suspense>
        </WrapperContainer>
      </div>
    </MainPageScroll>
  );
};

export default AdminNotificationsPage;
