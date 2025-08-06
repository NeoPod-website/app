import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { BellIcon } from "lucide-react";
import { notFound } from "next/navigation";

import MainPageScroll from "@/components/common/MainPageScroll";
import WrapperContainer from "@/components/common/WrapperContainer";
import LoadMoreNotifications from "@/components/layout/notification/LoadMoreNotifications";

export const metadata = {
  title: "Notifications | NeoPod",
  description:
    "Stay updated with the latest announcements, updates, and important information from the NeoPod community.",
};

// Fetch user's notifications - server-side only for initial load
export const fetchUserNotifications = async (limit = 20, lastKey = null) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  if (!token?.value) {
    throw new Error("Authentication token not found");
  }

  const params = new URLSearchParams({
    limit: limit.toString(),
  });

  if (lastKey) {
    params.append("lastEvaluatedKey", lastKey);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications?${params.toString()}`,
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
    if (response.status === 404) {
      return {
        notifications: [],
        pagination: { hasMore: false, nextKey: null },
      };
    }

    if (response.status === 403) {
      notFound();
    }

    throw new Error(`Failed to fetch notifications: ${response.status}`);
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

const AmbassadorNotificationsPage = async () => {
  // Fetch initial notifications
  const notificationData = await fetchUserNotifications(2);
  console.log(notificationData);

  // Empty state
  if (notificationData.notifications.length === 0) {
    return (
      <WrapperContainer
        scrollable={true}
        className="space-y-6 p-3 md:p-4 lg:p-6 3xl:space-y-8 3xl:p-10"
      >
        <div className="lg:space-y-2">
          <h2 className="font-work-sans text-2xl font-bold xl:text-3xl 3xl:text-4xl">
            Notifications
          </h2>

          <p className="text-base text-gray-200 xl:text-lg">
            Stay updated with the latest from NeoPod
          </p>
        </div>

        <div className="py-16 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gray-400 bg-gradient-dark backdrop-blur-sm xl:h-24 xl:w-24">
            <BellIcon size={32} className="h-7 w-7 xl:h-8 xl:w-8" />
          </div>

          <h3 className="mb-2 text-xl font-semibold text-white 3xl:text-2xl">
            No notifications yet
          </h3>

          <p className="text-gray-200">
            You're all caught up! New notifications will appear here when
            available.
          </p>
        </div>
      </WrapperContainer>
    );
  }

  return (
    <MainPageScroll scrollable={false}>
      <WrapperContainer
        scrollable={true}
        className="space-y-6 p-3 md:p-4 lg:p-6 3xl:space-y-8 3xl:p-10"
      >
        <div className="space-y-2">
          <h2 className="font-work-sans text-2xl font-bold xl:text-3xl 3xl:text-4xl">
            Notifications
          </h2>

          <p className="text-lg text-gray-200">
            Stay updated with the latest from NeoPod •{" "}
            {notificationData.totalResults} total
          </p>
        </div>

        <Suspense>
          <LoadMoreNotifications
            initialNotifications={notificationData.notifications}
            initialNextKey={notificationData.pagination.nextKey}
            initialHasMore={notificationData.pagination.hasMore}
          />
        </Suspense>
      </WrapperContainer>
    </MainPageScroll>
  );
};

export default AmbassadorNotificationsPage;
