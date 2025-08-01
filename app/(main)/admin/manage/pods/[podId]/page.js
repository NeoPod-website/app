import React from "react";
import { cookies } from "next/headers";
import { Undo2Icon } from "lucide-react";
import { notFound } from "next/navigation";

import { getCachedSession } from "@/lib/userSession";

import AdminPodMain from "@/components/layout/pods/manage/AdminPodsMain";
import ManagePageWrapper from "@/components/layout/pods/ManagePageWrapper";

const breadcrumbsList = [
  {
    title: "Manage",
  },

  {
    title: "Pods",
    href: "/admin/manage/pods",
  },

  {
    title: "Edit",
    href: "/admin/manage/pods/[podId]",
  },
];

export const metadata = {
  title: "Edit POD | Admin Panel | NeoPod",
  description:
    "Edit an existing POD for ambassadors and admins to manage and engage with them.",
};

async function fetchPods(podId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("neo-jwt");

    let url = `${process.env.NEXT_PUBLIC_API_URL}/pods/${podId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      credentials: "include",
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }

      throw new Error(`Failed to fetch pod: ${response.statusText}`);
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching pod:", error);

    throw error;
  }
}

const EditPodPage = async ({ params }) => {
  const { podId } = await params;

  const { user } = await getCachedSession();

  const podData = await fetchPods(podId);

  return (
    <ManagePageWrapper
      linkLabel="PODS"
      scrollable={false}
      list={breadcrumbsList}
      href="/admin/manage/pods"
      icon={<Undo2Icon size={16} className="-mt-0.5" />}
    >
      <AdminPodMain
        id={podId}
        isNew={false}
        role={user.role_type}
        initialPod={podData.pod}
      />
    </ManagePageWrapper>
  );
};

export default EditPodPage;
