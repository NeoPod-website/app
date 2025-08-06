import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Undo2Icon } from "lucide-react";

import ManagePageWrapper from "@/components/layout/pods/ManagePageWrapper";
import AdminNotificationMain from "@/components/layout/notification/admin/AdminNotificationMain";

const fetchNotificationById = async (notificationId) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("neo-jwt");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}`,
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
      notFound();
    }

    if (response.status === 403) {
      notFound();
    }

    throw new Error(`Failed to fetch notification: ${response.status}`);
  }

  const data = await response.json();
  return data.data?.notification || null;
};

const EditNotificationPage = async ({ params }) => {
  const { notificationId } = await params;

  const notificationData = await fetchNotificationById(notificationId);

  const breadcrumbsList = [
    {
      title: "Admin",
    },
    {
      title: "Notifications",
      href: "/admin/notifications",
    },
    {
      title: "Edit",
    },
  ];

  return (
    <ManagePageWrapper
      linkLabel="Back"
      scrollable={false}
      list={breadcrumbsList}
      href="/admin/notifications"
      icon={<Undo2Icon size={16} className="-mt-0.5" />}
    >
      <AdminNotificationMain
        isNew={false}
        initialNotificationData={notificationData}
      />
    </ManagePageWrapper>
  );
};

export default EditNotificationPage;
